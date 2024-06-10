package com.example.fileFetcher;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
// @EnableJpaRepositories(basePackages = "com.example.fileFetcher.repository")
// @EnableJpaRepositories(basePackages = "com.example.fileFetcher.repository")
// @EntityScan(basePackages = "com.example.fileFetcher.entity")
public class FileFetcherApplication {

	public static void main(String[] args) {
		SpringApplication.run(FileFetcherApplication.class, args);
	}

}
