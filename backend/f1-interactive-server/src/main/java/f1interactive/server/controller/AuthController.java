package f1interactive.server.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import f1interactive.server.services.JwtTokenService;

@RestController
@RequestMapping("/auth")
class AuthController {
    record JwtRequest(String username, String password, Boolean rememberMe) {}
    record RefreshTokenRequest (String refresh_token) {}
    record JwtResponse(String access_token, String refresh_token, String token_type) {}
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

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
            throw new AuthenticationException("Refresh Token Validation Exception") {};
        }

    }

    private void authenticate(String username, String password) throws AuthenticationException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    @PostMapping(value = "/logout")
    public ResponseEntity<?> logout(){
        logger.debug("Logout");
        return ResponseEntity.ok(null);
    }

}
