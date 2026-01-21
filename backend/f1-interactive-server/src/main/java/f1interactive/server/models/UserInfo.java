package f1interactive.server.models;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="USERS")
public class UserInfo {
    @Id
    private Long id;
    private String name;
    private String password;

    @Convert(converter = StringArrayConverter.class)
    private String[] roles;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public String[] getRoles() {
        return roles;
    }
}
