-- ============================================================
--  LumiPlus – Clínica Dental & Psicológica
--  Schema para PostgreSQL (Render)
--
--  ⚠️  Render gestiona la base de datos mediante DATABASE_URL.
--  NO se usa CREATE DATABASE ni \c: el cliente ya se conecta
--  directamente a la DB correcta según esa variable.
-- ============================================================

-- ----------------------------------------------------------
-- Tipos ENUM de PostgreSQL
-- ----------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE tipo_consulta_enum AS ENUM ('odontologica', 'psicologica');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_cita_enum AS ENUM ('pendiente', 'confirmada', 'cancelada', 'completada');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ----------------------------------------------------------
-- Tabla de pacientes
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS pacientes (
  id           SERIAL          PRIMARY KEY,
  nombre       VARCHAR(100)    NOT NULL,
  apellido     VARCHAR(100)    NOT NULL,
  telefono     VARCHAR(20)     NOT NULL,
  email        VARCHAR(150)    UNIQUE,
  fecha_nac    DATE,
  creado_en    TIMESTAMPTZ     DEFAULT NOW()
);

-- ----------------------------------------------------------
-- Tabla de citas
-- Columna: tipo_consulta  →  'odontologica' | 'psicologica'
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS citas (
  id               SERIAL                PRIMARY KEY,
  paciente_id      INT                   NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  tipo_consulta    tipo_consulta_enum    NOT NULL,
  fecha_cita       DATE                  NOT NULL,
  hora_cita        TIME                  NOT NULL,
  motivo           TEXT,
  estado           estado_cita_enum      NOT NULL DEFAULT 'pendiente',
  notas_internas   TEXT,
  creado_en        TIMESTAMPTZ           DEFAULT NOW(),
  actualizado_en   TIMESTAMPTZ           DEFAULT NOW()
);

-- Actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION set_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_citas_actualizado ON citas;
CREATE TRIGGER trg_citas_actualizado
  BEFORE UPDATE ON citas
  FOR EACH ROW EXECUTE FUNCTION set_actualizado_en();

-- ----------------------------------------------------------
-- Índices
-- ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_citas_tipo   ON citas (tipo_consulta);
CREATE INDEX IF NOT EXISTS idx_citas_fecha  ON citas (fecha_cita);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas (estado);

-- ----------------------------------------------------------
-- Vista para el panel de administración
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW v_citas_detalle AS
SELECT
  c.id,
  c.tipo_consulta,
  p.nombre || ' ' || p.apellido  AS paciente,
  p.telefono,
  p.email,
  c.fecha_cita,
  c.hora_cita,
  c.motivo,
  c.estado,
  c.creado_en
FROM citas c
JOIN pacientes p ON p.id = c.paciente_id;