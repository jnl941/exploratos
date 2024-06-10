package com.example.fileFetcher.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.fileFetcher.entity.Comment;
import com.example.fileFetcher.entity.CustomFile;
import com.example.fileFetcher.repository.CustomFileRepository;

@Service

@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
public class CustomFileService {
    @Autowired
    private CustomFileRepository fileRepository;

    public List<CustomFile> getAllFiles(){
        return fileRepository.findAll();
    }
    public Optional<CustomFile> findByPath(String path){
        return fileRepository.findByPath(path);
    }
    public Optional<CustomFile> findById(Long id) {
        return fileRepository.findById(id);
    }

    public CustomFile save(CustomFile file) {
        return fileRepository.save(file);
    }
}
