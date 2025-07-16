package com.pawfund.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

@Configuration
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Bean
    public CommandLineRunner testDatabaseConnection() {
        return args -> {
            try (Connection connection = dataSource.getConnection()) {
                DatabaseMetaData metaData = connection.getMetaData();
                
                System.out.println("\n");
                System.out.println("==================================");
                System.out.println("Database Connection Test");
                System.out.println("==================================");
                System.out.println("Database is connected: " + !connection.isClosed());
                System.out.println("Database product name: " + metaData.getDatabaseProductName());
                System.out.println("Database product version: " + metaData.getDatabaseProductVersion());
                System.out.println("Database URL: " + metaData.getURL());
                System.out.println("Database username: " + metaData.getUserName());
                System.out.println("Database driver name: " + metaData.getDriverName());
                System.out.println("Database driver version: " + metaData.getDriverVersion());
                
                // Test query execution
                try {
                    Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
                    System.out.println("Test query execution: Successful (Result = " + result + ")");
                } catch (Exception e) {
                    System.out.println("Test query execution: Failed");
                    System.out.println("Error: " + e.getMessage());
                }
                
                System.out.println("==================================\n");
            } catch (Exception e) {
                System.out.println("\n");
                System.out.println("==================================");
                System.out.println("Database Connection Failed!");
                System.out.println("Error: " + e.getMessage());
                System.out.println("==================================\n");
                throw e;
            }
        };
    }
}
