package com.proyecto.entity;

import jakarta.persistence.*;
import java.util.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "METODO_PAGO")
public class MetodoPago {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String metodo;

  @OneToMany(mappedBy = "metodoPago")
  @JsonIgnore
  private List<DetalleComprobante> comprobante;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getMetodo() {
    return metodo;
  }

  public void setMetodo(String metodo) {
    this.metodo = metodo;
  }

  public List<DetalleComprobante> getComprobante() {
    return comprobante;
  }

  public void setComprobante(List<DetalleComprobante> comprobante) {
    this.comprobante = comprobante;
  }
}
