package com.example.fileFetcher.services;

import com.example.fileFetcher.dto.DataPointDTO;
import com.example.fileFetcher.dto.TrajectoriesDTO;
import com.example.fileFetcher.dto.TrajectoryDTO;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class TrajectoryService {
    private static final String BASE_DIR = "src/main/resources/files";

    public List<TrajectoryDTO> readTrajectoriesFromFile(String filePath) throws Exception {
        List<TrajectoryDTO> trajectories = new ArrayList<TrajectoryDTO>();
        File file = ResourceUtils.getFile(BASE_DIR + filePath);
        
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            TrajectoryDTO currentTrajectory = new TrajectoryDTO();
            int i = 1;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    if (!currentTrajectory.getX().isEmpty()) {
                        currentTrajectory.setLabel("Trajectory " + (i++));
                        trajectories.add(currentTrajectory);
                        currentTrajectory = new TrajectoryDTO();
                    }
                } else {
                    String[] values = line.split("\\s+");
                    double timestamp = Double.parseDouble(values[0]);
                    currentTrajectory.getX().add(new DataPointDTO(timestamp, Double.parseDouble(values[1])));
                    currentTrajectory.getY().add(new DataPointDTO(timestamp, Double.parseDouble(values[2])));
                    currentTrajectory.getZ().add(new DataPointDTO(timestamp, Double.parseDouble(values[3])));
                    currentTrajectory.getVelocityX().add(new DataPointDTO(timestamp, Double.parseDouble(values[4])));
                }
            }

            if (!currentTrajectory.getX().isEmpty()) {
                        currentTrajectory.setLabel("Trajectory " + (i++));
                        trajectories.add(currentTrajectory);
            }
        }

        return trajectories;
    }
}
