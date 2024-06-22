package com.example.fileFetcher.controller;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
@RequestMapping("/execFile")
public class ExecuteController {
    
    private boolean isExecuting = false;
    
    private static final String BASE_DIR = "src/main/resources/files";
    @GetMapping("")
    public String executeFile(@RequestParam String filePath) {
        if (isExecuting) {
            return "Another execution is already in progress.";
        }
        
        isExecuting = true;
        
        try {
            try{
                File file = ResourceUtils.getFile(BASE_DIR + filePath);
            }
            catch (Exception e){
                return "File not found: " + e.getMessage();
            }
                
            // Lock the file here
            // ProcessBuilder processBuilder = new ProcessBuilder("./"+ BASE_DIR + filePath);
            // // Execute the file as a normal binary file
            // Process proc = processBuilder.start();
            Process proc = Runtime.getRuntime().exec("./" + BASE_DIR + filePath);
        proc.waitFor();
            
            // Unlock the file here
            proc.waitFor();
            isExecuting = false;
            
            return "File executed successfully. path=" + BASE_DIR + filePath;
        } catch (Exception e) {
            return "Failed to execute file: " + e.getMessage();
        } finally {
            isExecuting = false;
        }
    }
    
}
