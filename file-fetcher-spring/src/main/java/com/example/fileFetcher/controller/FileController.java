package com.example.fileFetcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.fileFetcher.services.FileService;

import org.springframework.web.bind.annotation.CrossOrigin;


import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
@RequestMapping("/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @GetMapping
    public Map<String, Object> getFilesAndDirectories() throws IOException {
        return fileService.getFilesAndDirectories("src/main/resources/files");
    }
}
