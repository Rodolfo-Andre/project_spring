import { showModal } from "./modal.js";

const ViewCore = function () {
  this.Core = {
    contextUrl: "/configuracion/mesa",
    apis: {
      listar: "/obtener",
    },
    init: async function () {
      this.getComandas();
      this.bntAddComanda = $("#btn-add");
    },
    getComandas: async function () {
      const url = this.contextUrl + this.apis.listar;

      const response = await fetch(url);
      const result = await response.json();

      if (!result.length) {
        const {
          empleado: {
            cargo: { nombre },
          },
        } = await this.getCurrentUser();

        const text = ["ROLE_COCINERO", "ROLE_CAJERO"].includes(nombre)
          ? "COMANDAS"
          : "MESAS";

        $("#tableComandas")
          .html(`<span class="text-center">Sin ${text.toLowerCase()}</span>`)
          .addClass("justify-content-center");
        this.showNoTablesModal(text);
        return;
      }

      this.generateComanda(result);
    },
    generateComanda: function (data) {
      let html = "";

      data.forEach((element) => {
        if (element.estado == "Ocupado") {
          const url = `/configuracion/comanda/comanda-libre/${element.id}`;
          fetch(url)
            .then((response) => response.json())
            .then((comanda) => {
              console.log(comanda);

              if (comanda) {
                html += `
                <div class="col">
                  <div class="card h-100 border-4 border-danger js-container-comanda" data-id="${element.id}">
                    <div class="card-body d-flex flex-column justify-content-center align-items-center">
                      <h5 class="card-title text-center">ID: ${element.id}</h5>
                      
                      <h5 class="card-title text-center text-danger">
                      ${element.estado}
                      </h5>
                      
                      <h5 class="card-title text-center">
                      Empleado: ${comanda.empleado.nombre}
                      </h5>
                      
                      <h5 class="card-title text-center ">
                      Fecha: ${comanda.fechaEmision}
                      </h5>
                      
                      <h5 class="card-title text-center ">
                      Estado: ${comanda.estadoComanda.estado}
                      </h5>
                    
                      <h5 class="card-title text-center">
                      Precio comanda: ${comanda.precioTotal}
                      </h5> 
                    </div>
                  </div>
                </div>
              `;
              }

              $("#tableComandas").html(html);

              $(".js-container-comanda").on("click", function (ev) {
                const id = $(this).data("id");
                window.location.href = "/configuracion/comanda/detalle/" + id;
              });
            })
            .catch((error) => {
              console.error("Error en la solicitud AJAX:", error);
            });
        } else {
          html += `
          <div class="col">
            <div class="card h-100 border-4 border-success js-container-comanda" data-id="${element.id}" style="min-height: 224px;">
              <div class="card-body d-flex flex-column justify-content-center align-items-center">
                <h5 class="card-title text-center">ID: ${element.id}</h5>
                
                <h5 class="card-title text-center text-success">
                  ${element.estado}
                </h5>
              </div>
            </div>  
          </div>
        `;
        }
      });

      $("#tableComandas").html(html);
      $(".js-container-comanda").on("click", function (ev) {
        const id = $(this).data("id");
        window.location.href = "/configuracion/comanda/detalle/" + id;
      });
    },
    showInfoComanda: function (id) {
      const data = {
        id: null,
        cantidadAsientos: 4,
        precioTotal: id,
        mesa: {
          id: null,
          cantidadAsientos: 4,
          estado: "Disponible",
        },
        estadoComanda: {
          id: null,
          estado: "Pendiente",
        },
        empleado: {
          id: null,
          nombre: "John",
          apellido: "Doe",
          telefono: "123456789",
          dni: "12345678",
          fechaRegistro: "2023-05-27T09:17:06.599+00:00",
          cargo: null,
          usuario: null,
        },
        comprobante: null,
      };

      const modalInfo = this.templateComanda().modalInfoComanda(data);
      showModal(modalInfo);
    },
    showNoTablesModal: function (text) {
      const contentModal = {
        header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i>	
                    <h4 class="modal-title text-center" id="modal-prototype-label">NO HAY ${text} </h4>`,
        body: `<p style="text-align: justify;">No se puede realizar ninguna acción porque no exiten ${text.toLowerCase()}</p>`,
        footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-danger">CERRAR</button>`,
      };

      showModal(contentModal);
    },
    getCurrentUser: async function () {
      const result = await $.ajax("/usuario");
      return result;
    },
    convertDate: function (date) {
      let d = new Date(date);
      let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
      let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return `${da}/${mo}/${ye}`;
    },
    templateComanda: function () {
      let me = this;

      return {
        modalInfoComanda: function (data) {
          return {
            header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i> `,
            body: `<div class="text-center">
              <div><strong>Numero de la Comanda:</strong> ${data.id}</div>
              <div><strong>Numero de la Mesa:</strong> ${data.mesa.id}</div>
              <div><strong>Estado de la Comanda:</strong> ${
                data.estadoComanda.estado
              }</div>
              <div><strong>Nombre del Empleado:</strong> ${
                data.empleado.nombre + " " + data.empleado.apellido
              }</div>
              <div><strong>Fecha de Registro:</strong> ${me.convertDate(
                data.empleado.fechaRegistro
              )}</div>
              <div><strong>Precio Total:</strong> ${data.precioTotal}</div>
              </div>`,
            footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`,
          };
        },
      };
    },
  };
};

$(function () {
  let view = new ViewCore();
  view.Core.init();
});
