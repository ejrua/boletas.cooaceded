

async function estado() {
//  $.getJSON('http://api.cooaceded.coop/estado/personaRegistro/73147678/', data => console.log(data));
  alert("Si entra");
  //cedula =  document.getElementById("cedula").value
 // alert(cedula);
 // console.log(cedula);
  // await axios.get('http://api.cooaceded.coop/estado/personaRegistro/73147678/').then((response) => {
  //               console.log(response);
  //               alert(response)
  //               //return response;
  //       });
// const resp = axios.get('http://api.cooaceded.coop/estado/personaRegistro/73147678')
//       .then(function (response) {
//         console.log(response);
//        // alert(response)
//     //   return response
//         console.log(response);
//       })
//       .catch(function (error) {
//         // handle error
//         console.log(error);
//       })
//       .finally(function () {
//       //  alert(response.data[0].fields.empleado)
//         // always executed
//       });
  
    try {
     
      const response = await axios.get('http://api.cooaceded.coop:3333/excepcion/query');
      alert("Si pasa");
      console.log(response);
      alert(response.data[0].fields.empleado);
    } catch (error) {
      console.log(error);
      alert(error)
    }
  

  // axios({
  //   method: 'get',
  //   url: 'http://api.cooaceded.coop/estado/personaRegistro/73147678'
  // })
  //   .then(function (response) {
  //     console.log(response.data);
  //     alert(response.data);
  
  //     document.getElementById("h3").value = response.data.pk;
  //   });
  
  // alert(resp.data[0].fields.empleado)    
  // console.log(resp)
  // url = 'http://api.cooaceded.coop/estado/personaRegistro/' + cedula
  // $.ajax({
  //   url: url,
  //   dataType: "json",
  //   success: function(respuesta) {
  //      $( "#identificacion" ).html(  respuesta[0].fields.empleado );
  //      $( "#lvota" ).html(  respuesta[0].fields.votacion );
  //      alert(respuesta[0].fields.votacion);
  //      console.log(respuesta[0].fields);
  //      if( respuesta[0].fields.deudaaporte<=0 || respuesta[0].fields.sinaporte  <= 0){
  //         $("#h3").show();
  //         $("#i3").hide();
  //      }else{

  //        $("#i3").show();
  //        $("#h3").hide();
  //      };
  //      if( respuesta[0].fields.deudacredito<=0){
  //        $("#h4").show();
  //        $("#i4").hide();

  //      }else{
  //        $("#i4").show();
  //        $("#h4").hide();
  //      };
  //      if( respuesta[0].fields.afiliacion<=0){
  //        $("#h2").show();
  //        $("#i2").hide();

  //      }else{
  //        $("#i2").show();
  //        $("#h2").hide();
  //      };

  //   }

  // });
}