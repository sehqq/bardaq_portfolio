precision highp float;
            uniform float u_time;
            uniform float u_scroll;
            uniform float u_size;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            uniform vec3 u_colorCore;
            uniform vec3 u_colorFringe;
            uniform float u_isLightMode;
            uniform vec3 u_base; uniform float u_strength;

            vec2 hash( vec2 p ) {
                p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
                return -1.0 + 2.0*fract(sin(p)*43758.5453123);
            }
            float noise( in vec2 p ) {
                const float K1 = 0.366025404;
                const float K2 = 0.211324865;
                vec2 i = floor( p + (p.x+p.y)*K1 );
                vec2 a = p - i + (i.x+i.y)*K2;
                vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
                vec2 b = a - o + K2;
                vec2 c = a - 1.0 + 2.0*K2;
                vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
                vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
                return dot( n, vec3(70.0) );
            }

            float sdArc(vec2 p, vec2 center, float radius, float width, float warp) {
                p.y += sin(p.x * 2.0 + u_time * 0.3 + u_scroll * 0.65) * warp;
                p.x += noise(p * 1.5 + u_time * 0.1 + u_scroll * 0.16) * (warp * 0.8);
                float d = length(p - center) - radius;
                return abs(d) - width;
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec2 st = uv;
                st.x *= u_resolution.x / u_resolution.y;

                vec2 mouseOffset = (u_mouse - 0.5) * 0.05;
                st += mouseOffset;

                vec2 center = vec2(0.5 * u_resolution.x / u_resolution.y, 0.42);
                center += vec2(sin(u_scroll * 0.8) * 0.10, sin(u_scroll * 0.65) * 0.13);

                float d1 = sdArc(st, center, 0.62 * u_size, 0.012 * u_size, 0.15 * u_size);
                float d2 = sdArc(st, center, 0.66 * u_size, 0.04 * u_size, 0.2 * u_size);

                float coreGlow = exp(-d1 * 30.0);
                float fringeGlow = exp(-d2 * 10.0);
                float wash = (1.0 - smoothstep(0.0, 1.5, length(st - center))) * 0.15;

                vec3 finalColor = vec3(0.0);
                finalColor += u_colorCore * coreGlow;
                finalColor += u_colorFringe * fringeGlow;
                finalColor += u_colorFringe * wash * (sin(u_time * 0.5) * 0.2 + 0.8);

                float alpha = clamp(coreGlow + fringeGlow + wash, 0.0, 1.0);
                finalColor = vec3(1.0) - exp(-finalColor * 1.5);

                if(u_isLightMode > 0.5) {
                    alpha = clamp((coreGlow * 1.2 + fringeGlow + wash * 0.4), 0.0, 0.4);
                }

                gl_FragColor = vec4(u_base + finalColor * alpha * u_strength, 1.0);
            }
        
