package sn.jokko.sunugare.dto;

import jakarta.validation.constraints.NotNull;

public class LigneRequest {
    @NotNull(message = "La ville de départ est obligatoire")
    private Long villeDepartId;

    @NotNull(message = "La ville d'arrivée est obligatoire")
    private Long villeArriveeId;

    private Integer distanceKm;

    public Long getVilleDepartId() { return villeDepartId; }
    public void setVilleDepartId(Long villeDepartId) { this.villeDepartId = villeDepartId; }
    public Long getVilleArriveeId() { return villeArriveeId; }
    public void setVilleArriveeId(Long villeArriveeId) { this.villeArriveeId = villeArriveeId; }
    public Integer getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Integer distanceKm) { this.distanceKm = distanceKm; }
}