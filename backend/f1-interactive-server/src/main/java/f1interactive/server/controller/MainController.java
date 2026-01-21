package f1interactive.server.controller;

import f1interactive.server.services.UsersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
class MainController {

    record UserResponse(String name, String avatar, String[] roles) {}
    private static final Logger logger = LoggerFactory.getLogger(MainController.class);

    @GetMapping(value = "/user")
    public ResponseEntity<?> user() throws Exception {
        logger.debug("user request");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String[] roles = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toArray(String[]::new);
            return ResponseEntity.ok(new UserResponse(authentication.getName(), "images/admin.png", roles));
        } else {
            throw new RuntimeException("Not Authenticated");
        }
    }

}
