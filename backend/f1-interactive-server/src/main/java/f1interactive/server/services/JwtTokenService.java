package f1interactive.server.services;

import java.util.Date;
import java.util.function.Function;

import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
public class JwtTokenService {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenService.class);
    private final long ACCESS_TOKEN_VALIDITY = 5 * 60; // 1 hour
    private final long REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60; // 7 days
    private final String issuer = "f1interactive";

    private final SecretKey secretKey = Jwts.SIG.HS256.key().build();;

    // ToDo not implemented. How to invalidate? save tokens in DB?
    public void invalidateToken(String token) {

    }

    public boolean validateToken(String token) {
        try {
            Jws<Claims> claimsJws = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
            return (claimsJws.getPayload().getIssuer().equals(issuer));
        } catch (JwtException | IllegalArgumentException ex) {
            logger.debug("Token validation failed: {}", ex.getMessage());
            return false;
        }
    }
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
    }

    private String doGenerateToken(String username, long expirationMillis) {
        return Jwts.builder()
                .header().add("typ", "JWT")
                .and()
                .subject(username)
                .issuer(issuer)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(secretKey)
                .compact();
    }
    //generate token for user
    public String generateAccessToken(String username) {
        return doGenerateToken(username, ACCESS_TOKEN_VALIDITY * 1000);
    }

    public String generateRefreshToken(String username) {
        return doGenerateToken(username, REFRESH_TOKEN_VALIDITY * 1000);
    }

    /**
     *
     * @param bearerString Bearer <tokenInBase64>
     * @return null if bearer string not found
     */
    public static String getTokenFromBearerString(String bearerString) {
        if (bearerString != null && bearerString.startsWith("Bearer ")) {
            return bearerString.substring(7);
        }
        return null;
    }
}
