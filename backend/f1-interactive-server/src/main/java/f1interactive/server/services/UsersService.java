package f1interactive.server.services;

import f1interactive.server.models.UserInfo;
import f1interactive.server.repositories.UsersRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService implements UserDetailsService {
    @Autowired
    UsersRepository usersRepository;

    @Override
    @NonNull
    public UserDetails loadUserByUsername(@NonNull String userName) throws UsernameNotFoundException {
        List<UserInfo> byName = usersRepository.findByNameIgnoreCase(userName);
        UserInfo userInfo = byName.get(0);
        if (userInfo == null)
            throw new UsernameNotFoundException("User with name: " + userName + " not found");
        return User.withUsername(userInfo.getName())
                .password(userInfo.getPassword()) // Use {noop} for plain text (dev only)
                .authorities(userInfo.getRoles())
                .build();
    }
}
