# exploratos

Aplicación en Angular y Springboot hecha a partir de ngx-explorer cómo explorador colaborativo.


**Contribuciones:**
- Servidor de archivos locales en Springboot
- Conexión con la API de GitHub para buscar repositorios (https://api.github.com/)
  - Se hace uso de ello a través de la carpeta falsa "Github Search"
- Scrapping para obtener posts de Github.
- Abrir archivos locales y ver su contenido textual.


**Carpetas y principales:**
- Springboot:
  - file-fetcher-spring/
  - Controllers:
    - /controller/
  - Dtos:
    - /dto/
  - Entidades:
    - /entity/
  - Repositorios:
    - /repository/
  - Servicios:
    - /services/
- Angular:
  - ngx-explorer/
    - Ventanas desplegables:
      - /login-dialog/
      - /register-dialog/
      - /file-content-view-dialog/
      - /search-dialog/
    - Servicios:
      - Api Springboot:
        - /api.service.ts (Comentarios, Scrapping)
        - /auth.service.ts (Iniciar sesión y registarse)
        - /file-fetcher.service.ts (Archivos locales)
      - Obtención de datos (carpetas, archivos, etc...)
        - /data.service.ts
      - Api Github:
        - github.service.ts

**Endpoints:**
- Buscar usuarios:
  - http://localhost:8080/api/findUsers/{nombre}
- Usuarios:
  - http://localhost:8080/api/users
- Archivos locales de Springboot:
  - http://localhost:8080/api/files 
- Archivos comentados:
  - http://localhost:8080/api/savedfiles 
- Iniciar sesión:
  - http://localhost:8080/api/auth/login (Body: username, password) 
- Registrarse:
  - http://localhost:8080/api/auth/register (Body: username, password)
- Artículos de Github:
  - http://localhost:8080/api/articles/githubArticles
