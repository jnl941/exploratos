package com.example.fileFetcher.controller;

import com.example.fileFetcher.dto.TrajectoriesDTO;
import com.example.fileFetcher.dto.TrajectoryDTO;
import com.example.fileFetcher.dto.TrajectoryRequest;
import com.example.fileFetcher.services.TrajectoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
@RequestMapping("/trajs")
public class TrajectoryController {

    @Autowired
    private TrajectoryService trajectoryService;

    @GetMapping
    public List<TrajectoryDTO> getTrajectories(@RequestParam String filePath) {
        try {
            return trajectoryService.readTrajectoriesFromFile(filePath);
        } catch (Exception e) {
            throw new RuntimeException("Error reading file: " + e.getMessage(), e);
        }
    }
}
