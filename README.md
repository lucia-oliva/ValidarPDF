# ValidarPDF

 Revisa archivos PDF (u otros) en busca de código JavaScript o PHP que pueda estar escondido dentro del archivo. Dectecta codigo JS o PHP que podria estar en archivos PDF de forma superficial.

## Pasos

1. Ponér PDF dentro de la carpeta `upload/`.
2. Ejecutar el script. (Asegurarse de estar en la ruta correcta para ejecutarlo)
3. El script analiza cada archivo y te muestra si encontró algo sospechoso (como `/JavaScript`, `<?php`, `eval()`, etc.). Se puede modificar lo que se dectecta en la constante PATTERNS.


## Requisitos

- Node.js (versión 14 o más)
- npm (el gestor de paquetes de Node)
- Instalar dependencia file-type. (npm install)


```bash
npm install
node scan.js