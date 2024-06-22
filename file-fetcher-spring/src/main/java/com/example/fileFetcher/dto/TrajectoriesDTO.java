package com.example.fileFetcher.dto;

import java.util.ArrayList;

public class TrajectoriesDTO {
    public String label;
    public ArrayList<TrajectoryDTO> trajectories;
    public TrajectoriesDTO(String label, ArrayList<TrajectoryDTO> trajectories) {
        this.label = label;
        this.trajectories = trajectories;
    }
    public TrajectoriesDTO(String label) {
        this.label = label;
        this.trajectories = new ArrayList<TrajectoryDTO>();
    }
    public TrajectoriesDTO() {
        this.trajectories = new ArrayList<TrajectoryDTO>();
    }
    public String getLabel() {
        return label;
    }
    public void setLabel(String label) {
        this.label = label;
    }
    public ArrayList<TrajectoryDTO> getTrajectories() {
        return trajectories;
    }
    public void setTrajectories(ArrayList<TrajectoryDTO> trajectories) {
        this.trajectories = trajectories;
    }
}
