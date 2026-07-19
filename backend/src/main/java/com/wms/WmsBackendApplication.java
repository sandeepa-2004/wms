package com.wms;

import com.wms.model.User;
import com.wms.model.Bin;
import com.wms.repository.UserRepository;
import com.wms.repository.BinRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class WmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(WmsBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedDatabase(UserRepository userRepository, BinRepository binRepository) {
		return args -> {

			if (!userRepository.existsByUsername("admin")) {
				User admin = User.builder()
						.username("admin")
						.password("admin123")
						.email("admin@wms.com")
						.role("ADMIN")
						.phone("0115673426")
						.address("124 Dodangoda Kalutara")
						.build();
				userRepository.save(admin);
				System.out.println("Seeded Default Admin: admin / admin123");
			}




		};
	}
}
