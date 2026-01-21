package f1interactive.server.configuration;

import java.io.IOException;
import f1interactive.server.services.UsersService;
import f1interactive.server.services.JwtTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain)
            throws ServletException, IOException {

        String jwtToken = JwtTokenService.getTokenFromBearerString(request.getHeader("Authorization"));
        if (jwtToken != null && jwtTokenService.validateToken(jwtToken)) { // token is valid
                String username = jwtTokenService.getUsernameFromToken(jwtToken); // this checks
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = this.usersService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // user authenticated, set authentication
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
        }
        // if not authentication set should fail (if not configured in WebSecurityConfig)
        chain.doFilter(request, response);
    }
}
