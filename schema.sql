-- ============================================
-- CLÍNICA DENTAL - SCRIPT DE BASE DE DATOS
-- Compatible con PostgreSQL 14+
-- ============================================

-- Extensión para UUIDs (opcional, usamos SERIAL por defecto)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
    id            SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono      VARCHAR(20)  NOT NULL,
    email         VARCHAR(150) NOT NULL,
    fecha         DATE         NOT NULL,
    hora          TIME         NOT NULL,
    motivo        VARCHAR(100) NOT NULL,
    estado        VARCHAR(20)  NOT NULL DEFAULT 'pendiente'
                  CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
    notas         TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_citas_fecha   ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_estado  ON citas(estado);
CREATE INDEX IF NOT EXISTS idx_citas_email   ON citas(email);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_citas_updated_at ON citas;
CREATE TRIGGER trg_citas_updated_at
    BEFORE UPDATE ON citas
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Datos de prueba (comentar en producción)
-- INSERT INTO citas (nombre_completo, telefono, email, fecha, hora, motivo)
-- VALUES ('María García', '+502 5555-1234', 'maria@example.com', CURRENT_DATE + 1, '09:00', 'Limpieza dental');
