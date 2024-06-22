package com.example.fileFetcher.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
@RequestMapping("/execFile")
public class ExecuteController {
    
    private static final Logger logger = LoggerFactory.getLogger(ExecuteController.class);
    
    private volatile boolean isExecuting = false;
    
    private static final String BASE_DIR = "src/main/resources/files";
    
    @GetMapping("")
    public String executeFile(@RequestParam String filePath) {
        if (isExecuting) {
            return "Another execution is already in progress.";
        }
        
        isExecuting = true;
        
        try {
            String fullPath = BASE_DIR + filePath;
            File file = new File(fullPath);
            
            if (!file.exists()) {
                logger.error("File does not exist: " + fullPath);
                return "File does not exist: " + fullPath;
            }
            
            logger.info("Attempting to execute file: " + fullPath);
            String[] pathParts = fullPath.split("/");
            ProcessBuilder processBuilder = new ProcessBuilder("/bin/bash", "-c","./"+pathParts[pathParts.length-1]);
            processBuilder.directory(file.getParentFile());
            
            Process proc = processBuilder.start();
            int exitCode = proc.waitFor();
            
            logger.info("Process exited with code: " + exitCode);
            
            isExecuting = false;
            
            return "File executed successfully. path=" + pathParts[pathParts.length-1];
        } catch (IOException e) {
            logger.error("IOException occurred while executing file: ", e);
            return "Failed to execute file due to IOException: " + e.getMessage();
        } catch (InterruptedException e) {
            logger.error("InterruptedException occurred while executing file: ", e);
            Thread.currentThread().interrupt();
            return "Failed to execute file due to InterruptedException: " + e.getMessage();
        } finally {
            isExecuting = false;
        }
    }
}
