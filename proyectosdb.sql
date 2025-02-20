-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-02-2025 a las 17:23:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyectosdb`
--
CREATE DATABASE IF NOT EXISTS `proyectosdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci;
USE `proyectosdb`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

DROP TABLE IF EXISTS `departamentos`;
CREATE TABLE IF NOT EXISTS `departamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `departamentos`
--

INSERT INTO `departamentos` (`id`, `nombre`) VALUES
(1, 'Desarrollo de Software'),
(3, 'Finanzas'),
(4, 'Marketing'),
(2, 'Recursos Humanos'),
(5, 'Soporte Técnico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

DROP TABLE IF EXISTS `empleados`;
CREATE TABLE IF NOT EXISTS `empleados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  `departamento_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `departamento_id` (`departamento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id`, `nombre`, `cargo`, `departamento_id`) VALUES
(1, 'Juan Pérez', 'Gerente de Proyectos', 1),
(2, 'María López', 'Jefe de Equipo', 1),
(3, 'Carlos Ramírez', 'Desarrollador Senior', 1),
(4, 'Ana Torres', 'Especialista en RRHH', 2),
(5, 'Pedro Gómez', 'Analista Financiero', 3),
(6, 'Laura Martínez', 'Gerente de Marketing', 4),
(7, 'Sofía Herrera', 'Técnico de Soporte', 5),
(8, 'David Fernández', 'Programador Backend', 1),
(9, 'Elena Suárez', 'Desarrolladora Frontend', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

DROP TABLE IF EXISTS `proyectos`;
CREATE TABLE IF NOT EXISTS `proyectos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `responsable` int(11) NOT NULL,
  `proyectoPadre` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `responsable` (`responsable`),
  KEY `proyectoPadre` (`proyectoPadre`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`id`, `nombre`, `responsable`, `proyectoPadre`) VALUES
(1, 'Sistema de Gestión', 1, NULL),
(2, 'Desarrollo Web', 2, 1),
(3, 'API de Facturación', 3, 1),
(4, 'Automatización de RRHH', 4, NULL),
(5, 'Dashboard Financiero', 5, NULL),
(6, 'Campaña Publicitaria', 6, NULL),
(7, 'Soporte Técnico Avanzado', 7, NULL),
(8, '1', 1, 1),
(9, 'Js fuctions', 5, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

DROP TABLE IF EXISTS `tareas`;
CREATE TABLE IF NOT EXISTS `tareas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `empleado_id` int(11) NOT NULL,
  `estado` enum('Pendiente','En Progreso','Completada') DEFAULT 'Pendiente',
  `fecha_limite` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `proyecto_id` (`proyecto_id`),
  KEY `empleado_id` (`empleado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id`, `nombre`, `proyecto_id`, `empleado_id`, `estado`, `fecha_limite`) VALUES
(1, 'Diseñar base de datos', 1, 3, 'En Progreso', '2025-03-15'),
(2, 'Crear frontend en React', 2, 9, 'Pendiente', '2025-04-01'),
(3, 'Desarrollar API REST', 3, 8, 'Pendiente', '2025-04-10'),
(4, 'Implementar nómina automática', 4, 4, 'Pendiente', '2025-03-25'),
(5, 'Integración con contabilidad', 5, 5, 'Pendiente', '2025-04-05'),
(6, 'Redacción de contenido SEO', 6, 6, 'Pendiente', '2025-04-15'),
(7, 'Mejorar sistema de tickets', 7, 7, 'En Progreso', '2025-03-30');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`responsable`) REFERENCES `empleados` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proyectos_ibfk_2` FOREIGN KEY (`proyectoPadre`) REFERENCES `proyectos` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tareas_ibfk_2` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
