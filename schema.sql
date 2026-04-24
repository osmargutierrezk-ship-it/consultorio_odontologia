-- ============================================================
--  LumiPlus – Clínica Dental & Psicológica
--  Schema actualizado con soporte para dos tipos de consulta
-- ============================================================

CREATE DATABASE IF NOT EXISTS lumiplus_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lumiplus_db;

-- ----------------------------------------------------------
-- Tabla de pacientes
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS pacientes (
  id           INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(100)    NOT NULL,
  apellido     VARCHAR(100)    NOT NULL,
  telefono     VARCHAR(20)     NOT NULL,
  email        VARCHAR(150)    UNIQUE,
  fecha_nac    DATE,
  creado_en    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- Tabla de citas
-- Columna NUEVA: tipo_consulta  →  'odontologica' | 'psicologica'
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS citas (
  id               INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  paciente_id      INT UNSIGNED    NOT NULL,
  tipo_consulta    ENUM('odontologica','psicologica') NOT NULL
                     COMMENT 'Distingue si la cita es para la clínica dental o psicológica',
  fecha_cita       DATE            NOT NULL,
  hora_cita        TIME            NOT NULL,
  motivo           TEXT,
  estado           ENUM('pendiente','confirmada','cancelada','completada')
                     NOT NULL DEFAULT 'pendiente',
  notas_internas   TEXT,
  creado_en        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                     ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_cita_paciente
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- Índices útiles para búsquedas frecuentes
-- ----------------------------------------------------------
CREATE INDEX idx_citas_tipo    ON citas (tipo_consulta);
CREATE INDEX idx_citas_fecha   ON citas (fecha_cita);
CREATE INDEX idx_citas_estado  ON citas (estado);

-- ----------------------------------------------------------
-- Vista cómoda para el panel de administración
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW v_citas_detalle AS
SELECT
  c.id,
  c.tipo_consulta,
  CONCAT(p.nombre, ' ', p.apellido)  AS paciente,
  p.telefono,
  p.email,
  c.fecha_cita,
  c.hora_cita,
  c.motivo,
  c.estado,
  c.creado_en
FROM citas c
JOIN pacientes p ON p.id = c.paciente_id
ORDER BY c.fecha_cita, c.hora_cita;