package f1interactive.server.repositories;

import f1interactive.server.models.UserInfo;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<@NonNull UserInfo, @NonNull Long> {
    List<UserInfo> findByNameIgnoreCase(String name);
}
