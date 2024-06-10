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

import com.example.fileFetcher.entity.CustomFile;
import com.example.fileFetcher.repository.CustomFileRepository;

@Service
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
public class FileService {

    private static final String BASE_DIR = "src/main/resources/files";

    public Map<String, Object> getFilesAndDirectories(String dirPath) throws IOException {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, String>> files = new ArrayList<>();
        List<Map<String, String>> directories = new ArrayList<>();

        File directory = new File(dirPath);
        File[] items = directory.listFiles();

        if (items != null) {
            for (File item : items) {
                if (item.isDirectory()) {
                    Map<String, String> directoryInfo = new HashMap<>();
                    directoryInfo.put("id", String.valueOf(item.getName().hashCode()));
                    directoryInfo.put("name", item.getName());
                    directoryInfo.put("path", dirPath.replace(BASE_DIR, "")+"/");
                    directories.add(directoryInfo);
                    Map<String, Object> nestedItems = getFilesAndDirectories(item.getPath());
                    files.addAll((List<Map<String, String>>) nestedItems.get("files"));
                    directories.addAll((List<Map<String, String>>) nestedItems.get("directories"));
                } else {
                    Map<String, String> fileInfo = new HashMap<>();
                    fileInfo.put("id", String.valueOf(item.getName().hashCode()));
                    fileInfo.put("name", item.getName());
                    fileInfo.put("path", dirPath.replace(BASE_DIR, "")+"/");
                    fileInfo.put("content", new String(Files.readAllBytes(Paths.get(item.getPath()))));
                    files.add(fileInfo);
                }
            }
        }

        result.put("files", files);
        result.put("directories", directories);
        return result;
    }
}