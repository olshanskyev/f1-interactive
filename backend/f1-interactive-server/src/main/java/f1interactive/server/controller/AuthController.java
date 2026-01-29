package f1interactive.server.controller;

import f1interactive.server.services.UsersService;
import f1interactive.server.services.JwtTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
class AuthController {
    record JwtRequest(String username, String password, Boolean rememberMe) {}
    record RefreshTokenRequest (String refresh_token) {}
    record JwtResponse(String access_token, String refresh_token, String token_type) {}
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody JwtRequest authenticationRequest) throws Exception {
        logger.debug("Login request for user {}", authenticationRequest.username());
        authenticate(authenticationRequest.username(), authenticationRequest.password());
        final String accessToken = jwtTokenService.generateAccessToken(authenticationRequest.username());
        final String refreshToken = jwtTokenService.generateRefreshToken(authenticationRequest.username());
        return ResponseEntity.ok(new JwtResponse(accessToken, refreshToken,"Bearer"));
    }

    @PostMapping(value = "/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request) throws Exception {
        logger.debug("Refresh request for user");
        if (jwtTokenService.validateToken(request.refresh_token())) {
            String userName = jwtTokenService.getUsernameFromToken(request.refresh_token());
            final String accessToken = jwtTokenService.generateAccessToken(userName);
            final String refreshToken = jwtTokenService.generateRefreshToken(userName);
            jwtTokenService.invalidateToken(request.refresh_token());
            return ResponseEntity.ok(new JwtResponse(accessToken, refreshToken,"Bearer"));
        } else {
            throw new Exception("Not Authenticated");
        }

    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

    @PostMapping(value = "/logout")
    public ResponseEntity<?> logout(){
        logger.debug("Logout");
        return ResponseEntity.ok(null);
    }

}
