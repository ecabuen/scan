-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 23, 2024 at 04:11 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scan`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendanceID` int(11) NOT NULL,
  `teacher_Id` int(100) NOT NULL,
  `studentID` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendanceID`, `teacher_Id`, `studentID`, `date`, `status`) VALUES
(1, 10, 43, '2024-06-01', 'Present'),
(2, 10, 44, '2024-06-01', 'Present'),
(3, 10, 45, '2024-06-01', 'Absent'),
(4, 10, 46, '2024-06-01', 'Present'),
(5, 10, 47, '2024-06-01', 'Late'),
(6, 10, 48, '2024-06-01', 'Present'),
(7, 10, 49, '2024-06-01', 'Present'),
(8, 10, 50, '2024-06-01', 'Late'),
(9, 10, 51, '2024-06-01', 'Present'),
(10, 10, 52, '2024-06-01', 'Absent'),
(11, 10, 43, '2024-06-02', 'Present'),
(12, 10, 44, '2024-06-02', 'Present'),
(13, 10, 45, '2024-06-02', 'Absent'),
(14, 10, 46, '2024-06-02', 'Present'),
(15, 10, 47, '2024-06-02', 'Late'),
(16, 10, 48, '2024-06-02', 'Present'),
(17, 10, 49, '2024-06-02', 'Present'),
(18, 10, 50, '2024-06-02', 'Late'),
(19, 10, 51, '2024-06-02', 'Present'),
(20, 10, 52, '2024-06-02', 'Absent'),
(21, 10, 43, '2024-06-03', 'Present'),
(22, 10, 44, '2024-06-03', 'Present'),
(23, 10, 45, '2024-06-03', 'Absent'),
(24, 10, 46, '2024-06-03', 'Present'),
(25, 10, 47, '2024-06-03', 'Late'),
(26, 10, 48, '2024-06-03', 'Present'),
(27, 10, 49, '2024-06-03', 'Present'),
(28, 10, 50, '2024-06-03', 'Late'),
(29, 10, 51, '2024-06-03', 'Present'),
(30, 10, 52, '2024-06-03', 'Absent'),
(31, 10, 43, '2024-06-04', 'Present'),
(32, 10, 44, '2024-06-04', 'Present'),
(33, 10, 45, '2024-06-04', 'Absent'),
(34, 10, 46, '2024-06-04', 'Present'),
(35, 10, 47, '2024-06-04', 'Late'),
(36, 10, 48, '2024-06-04', 'Present'),
(37, 10, 49, '2024-06-04', 'Present'),
(38, 10, 50, '2024-06-04', 'Late'),
(39, 10, 51, '2024-06-04', 'Present'),
(40, 10, 52, '2024-06-04', 'Absent'),
(41, 10, 43, '2024-06-05', 'Present'),
(42, 10, 44, '2024-06-05', 'Present'),
(43, 10, 45, '2024-06-05', 'Absent'),
(44, 10, 46, '2024-06-05', 'Present'),
(45, 10, 47, '2024-06-05', 'Late'),
(46, 10, 48, '2024-06-05', 'Present'),
(47, 10, 49, '2024-06-05', 'Present'),
(48, 10, 50, '2024-06-05', 'Late'),
(49, 10, 51, '2024-06-05', 'Present'),
(50, 10, 52, '2024-06-05', 'Absent'),
(51, 10, 43, '2024-06-06', 'Present'),
(52, 10, 44, '2024-06-06', 'Present'),
(53, 10, 45, '2024-06-06', 'Absent'),
(54, 10, 46, '2024-06-06', 'Present'),
(55, 10, 47, '2024-06-06', 'Late'),
(56, 10, 48, '2024-06-06', 'Present'),
(57, 10, 49, '2024-06-06', 'Present'),
(58, 10, 50, '2024-06-06', 'Late'),
(59, 10, 51, '2024-06-06', 'Present'),
(60, 10, 52, '2024-06-06', 'Absent'),
(61, 10, 43, '2024-06-07', 'Present'),
(62, 10, 44, '2024-06-07', 'Present'),
(63, 10, 45, '2024-06-07', 'Absent'),
(64, 10, 46, '2024-06-07', 'Present'),
(65, 10, 47, '2024-06-07', 'Late'),
(66, 10, 48, '2024-06-07', 'Present'),
(67, 10, 49, '2024-06-07', 'Present'),
(68, 10, 50, '2024-06-07', 'Late'),
(69, 10, 51, '2024-06-07', 'Present'),
(70, 10, 52, '2024-06-07', 'Absent'),
(71, 10, 43, '2024-06-08', 'Present'),
(72, 10, 44, '2024-06-08', 'Present'),
(73, 10, 45, '2024-06-08', 'Absent'),
(74, 10, 46, '2024-06-08', 'Present'),
(75, 10, 47, '2024-06-08', 'Late'),
(76, 10, 48, '2024-06-08', 'Present'),
(77, 10, 49, '2024-06-08', 'Present'),
(78, 10, 50, '2024-06-08', 'Late'),
(79, 10, 51, '2024-06-08', 'Present'),
(80, 10, 52, '2024-06-08', 'Absent'),
(81, 10, 43, '2024-06-09', 'Present'),
(82, 10, 44, '2024-06-09', 'Present'),
(83, 10, 45, '2024-06-09', 'Absent'),
(84, 10, 46, '2024-06-09', 'Present'),
(85, 10, 47, '2024-06-09', 'Late'),
(86, 10, 48, '2024-06-09', 'Present'),
(87, 10, 49, '2024-06-09', 'Present'),
(88, 10, 50, '2024-06-09', 'Late'),
(89, 10, 51, '2024-06-09', 'Present'),
(90, 10, 52, '2024-06-09', 'Absent'),
(91, 10, 43, '2024-06-10', 'Present'),
(92, 10, 44, '2024-06-10', 'Present'),
(93, 10, 45, '2024-06-10', 'Absent'),
(94, 10, 46, '2024-06-10', 'Present'),
(95, 10, 47, '2024-06-10', 'Late'),
(96, 10, 48, '2024-06-10', 'Present'),
(97, 10, 49, '2024-06-10', 'Present'),
(98, 10, 50, '2024-06-10', 'Late'),
(99, 10, 51, '2024-06-10', 'Present'),
(100, 10, 52, '2024-06-10', 'Absent'),
(101, 10, 43, '2024-06-11', 'Present'),
(102, 10, 44, '2024-06-11', 'Present'),
(103, 10, 45, '2024-06-11', 'Present'),
(104, 10, 46, '2024-06-11', 'Present'),
(105, 10, 47, '2024-06-11', 'Present'),
(106, 10, 48, '2024-06-11', 'Present'),
(107, 10, 49, '2024-06-11', 'Present'),
(108, 10, 50, '2024-06-11', 'Present'),
(109, 10, 51, '2024-06-11', 'Present'),
(110, 10, 52, '2024-06-11', 'Present'),
(111, 10, 43, '2024-06-12', 'Present'),
(112, 10, 44, '2024-06-12', 'Absent'),
(113, 10, 45, '2024-06-12', 'Late'),
(114, 10, 46, '2024-06-12', 'Present'),
(115, 10, 47, '2024-06-12', 'Present'),
(116, 10, 48, '2024-06-12', 'Absent'),
(117, 10, 49, '2024-06-12', 'Present'),
(118, 10, 50, '2024-06-12', 'Late'),
(119, 10, 51, '2024-06-12', 'Present'),
(120, 10, 52, '2024-06-12', 'Absent'),
(121, 10, 43, '2024-06-13', 'Absent'),
(122, 10, 44, '2024-06-13', 'Present'),
(123, 10, 45, '2024-06-13', 'Present'),
(124, 10, 46, '2024-06-13', 'Present'),
(125, 10, 47, '2024-06-13', 'Late'),
(126, 10, 48, '2024-06-13', 'Present'),
(127, 10, 49, '2024-06-13', 'Absent'),
(128, 10, 50, '2024-06-13', 'Present'),
(129, 10, 51, '2024-06-13', 'Late'),
(130, 10, 52, '2024-06-13', 'Present'),
(131, 10, 43, '2024-06-14', 'Present'),
(132, 10, 44, '2024-06-14', 'Present'),
(133, 10, 45, '2024-06-14', 'Present'),
(134, 10, 46, '2024-06-14', 'Present'),
(135, 10, 47, '2024-06-14', 'Present'),
(136, 10, 48, '2024-06-14', 'Present'),
(137, 10, 49, '2024-06-14', 'Present'),
(138, 10, 50, '2024-06-14', 'Present'),
(139, 10, 51, '2024-06-14', 'Present'),
(140, 10, 52, '2024-06-14', 'Present'),
(141, 10, 43, '2024-06-15', 'Late'),
(142, 10, 44, '2024-06-15', 'Absent'),
(143, 10, 45, '2024-06-15', 'Present'),
(144, 10, 46, '2024-06-15', 'Present'),
(145, 10, 47, '2024-06-15', 'Late'),
(146, 10, 48, '2024-06-15', 'Present'),
(147, 10, 49, '2024-06-15', 'Present'),
(148, 10, 50, '2024-06-15', 'Absent'),
(149, 10, 51, '2024-06-15', 'Present'),
(150, 10, 52, '2024-06-15', 'Late'),
(151, 10, 43, '2024-06-16', 'Absent'),
(152, 10, 44, '2024-06-16', 'Present'),
(153, 10, 45, '2024-06-16', 'Absent'),
(154, 10, 46, '2024-06-16', 'Present'),
(155, 10, 47, '2024-06-16', 'Late'),
(156, 10, 48, '2024-06-16', 'Present'),
(157, 10, 49, '2024-06-16', 'Present'),
(158, 10, 50, '2024-06-16', 'Late'),
(159, 10, 51, '2024-06-16', 'Present'),
(160, 10, 52, '2024-06-16', 'Present'),
(161, 10, 43, '2024-06-17', 'Late'),
(162, 10, 44, '2024-06-17', 'Absent'),
(163, 10, 45, '2024-06-17', 'Present'),
(164, 10, 46, '2024-06-17', 'Present'),
(165, 10, 47, '2024-06-17', 'Present'),
(166, 10, 48, '2024-06-17', 'Present'),
(167, 10, 49, '2024-06-17', 'Present'),
(168, 10, 50, '2024-06-17', 'Absent'),
(169, 10, 51, '2024-06-17', 'Present'),
(170, 10, 52, '2024-06-17', 'Absent'),
(171, 10, 43, '2024-06-18', 'Present'),
(172, 10, 44, '2024-06-18', 'Present'),
(173, 10, 45, '2024-06-18', 'Present'),
(174, 10, 46, '2024-06-18', 'Present'),
(175, 10, 47, '2024-06-18', 'Present'),
(176, 10, 48, '2024-06-18', 'Present'),
(177, 10, 49, '2024-06-18', 'Present'),
(178, 10, 50, '2024-06-18', 'Present'),
(179, 10, 51, '2024-06-18', 'Present'),
(180, 10, 52, '2024-06-18', 'Present'),
(181, 10, 43, '2024-06-19', 'Present'),
(182, 10, 44, '2024-06-19', 'Absent'),
(183, 10, 45, '2024-06-19', 'Late'),
(184, 10, 46, '2024-06-19', 'Present'),
(185, 10, 47, '2024-06-19', 'Late'),
(186, 10, 48, '2024-06-19', 'Present'),
(187, 10, 49, '2024-06-19', 'Absent'),
(188, 10, 50, '2024-06-19', 'Present'),
(189, 10, 51, '2024-06-19', 'Late'),
(190, 10, 52, '2024-06-19', 'Present'),
(191, 10, 43, '2024-06-20', 'Absent'),
(192, 10, 44, '2024-06-20', 'Present'),
(193, 10, 45, '2024-06-20', 'Present'),
(194, 10, 46, '2024-06-20', 'Absent'),
(195, 10, 47, '2024-06-20', 'Late'),
(196, 10, 48, '2024-06-20', 'Present'),
(197, 10, 49, '2024-06-20', 'Present'),
(198, 10, 50, '2024-06-20', 'Late'),
(199, 10, 51, '2024-06-20', 'Absent'),
(200, 10, 52, '2024-06-20', 'Present'),
(201, 10, 43, '2024-06-21', 'Present'),
(202, 10, 44, '2024-06-21', 'Late'),
(203, 10, 45, '2024-06-21', 'Present'),
(204, 10, 46, '2024-06-21', 'Absent'),
(205, 10, 47, '2024-06-21', 'Present'),
(206, 10, 48, '2024-06-21', 'Present'),
(207, 10, 49, '2024-06-21', 'Late'),
(208, 10, 50, '2024-06-21', 'Present'),
(209, 10, 51, '2024-06-21', 'Absent'),
(210, 10, 52, '2024-06-21', 'Present'),
(211, 10, 43, '2024-06-22', 'Absent'),
(212, 10, 44, '2024-06-22', 'Present'),
(213, 10, 45, '2024-06-22', 'Present'),
(214, 10, 46, '2024-06-22', 'Late'),
(215, 10, 47, '2024-06-22', 'Present'),
(216, 10, 48, '2024-06-22', 'Absent'),
(217, 10, 49, '2024-06-22', 'Present'),
(218, 10, 50, '2024-06-22', 'Present'),
(219, 10, 51, '2024-06-22', 'Late'),
(220, 10, 52, '2024-06-22', 'Present'),
(221, 10, 43, '2024-06-23', 'Present'),
(222, 10, 44, '2024-06-23', 'Absent'),
(223, 10, 45, '2024-06-23', 'Present'),
(224, 10, 46, '2024-06-23', 'Present'),
(225, 10, 47, '2024-06-23', 'Present'),
(226, 10, 48, '2024-06-23', 'Late'),
(227, 10, 49, '2024-06-23', 'Absent'),
(228, 10, 50, '2024-06-23', 'Present'),
(229, 10, 51, '2024-06-23', 'Present'),
(230, 10, 52, '2024-06-23', 'Late'),
(231, 10, 43, '2024-06-24', 'Present'),
(232, 10, 44, '2024-06-24', 'Present'),
(233, 10, 45, '2024-06-24', 'Present'),
(234, 10, 46, '2024-06-24', 'Present'),
(235, 10, 47, '2024-06-24', 'Present'),
(236, 10, 48, '2024-06-24', 'Present'),
(237, 10, 49, '2024-06-24', 'Present'),
(238, 10, 50, '2024-06-24', 'Present'),
(239, 10, 51, '2024-06-24', 'Present'),
(240, 10, 52, '2024-06-24', 'Present'),
(241, 10, 43, '2024-06-25', 'Late'),
(242, 10, 44, '2024-06-25', 'Absent'),
(243, 10, 45, '2024-06-25', 'Present'),
(244, 10, 46, '2024-06-25', 'Present'),
(245, 10, 47, '2024-06-25', 'Present'),
(246, 10, 48, '2024-06-25', 'Late'),
(247, 10, 49, '2024-06-25', 'Absent'),
(248, 10, 50, '2024-06-25', 'Present'),
(249, 10, 51, '2024-06-25', 'Present'),
(250, 10, 52, '2024-06-25', 'Present'),
(251, 10, 43, '2024-06-26', 'Absent'),
(252, 10, 44, '2024-06-26', 'Present'),
(253, 10, 45, '2024-06-26', 'Present'),
(254, 10, 46, '2024-06-26', 'Late'),
(255, 10, 47, '2024-06-26', 'Present'),
(256, 10, 48, '2024-06-26', 'Absent'),
(257, 10, 49, '2024-06-26', 'Present'),
(258, 10, 50, '2024-06-26', 'Present'),
(259, 10, 51, '2024-06-26', 'Present'),
(260, 10, 52, '2024-06-26', 'Late'),
(261, 10, 43, '2024-06-27', 'Present'),
(262, 10, 44, '2024-06-27', 'Absent'),
(263, 10, 45, '2024-06-27', 'Late'),
(264, 10, 46, '2024-06-27', 'Present'),
(265, 10, 47, '2024-06-27', 'Present'),
(266, 10, 48, '2024-06-27', 'Absent'),
(267, 10, 49, '2024-06-27', 'Present'),
(268, 10, 50, '2024-06-27', 'Present'),
(269, 10, 51, '2024-06-27', 'Late'),
(270, 10, 52, '2024-06-27', 'Present'),
(271, 10, 43, '2024-06-28', 'Present'),
(272, 10, 44, '2024-06-28', 'Present'),
(273, 10, 45, '2024-06-28', 'Present'),
(274, 10, 46, '2024-06-28', 'Present'),
(275, 10, 47, '2024-06-28', 'Present'),
(276, 10, 48, '2024-06-28', 'Present'),
(277, 10, 49, '2024-06-28', 'Present'),
(278, 10, 50, '2024-06-28', 'Present'),
(279, 10, 51, '2024-06-28', 'Present'),
(280, 10, 52, '2024-06-28', 'Present'),
(281, 10, 43, '2024-06-29', 'Late'),
(282, 10, 44, '2024-06-29', 'Absent'),
(283, 10, 45, '2024-06-29', 'Present'),
(284, 10, 46, '2024-06-29', 'Present'),
(285, 10, 47, '2024-06-29', 'Late'),
(286, 10, 48, '2024-06-29', 'Absent'),
(287, 10, 49, '2024-06-29', 'Present'),
(288, 10, 50, '2024-06-29', 'Present'),
(289, 10, 51, '2024-06-29', 'Present'),
(290, 10, 52, '2024-06-29', 'Late'),
(291, 10, 43, '2024-06-30', 'Absent'),
(292, 10, 44, '2024-06-30', 'Present'),
(293, 10, 45, '2024-06-30', 'Present'),
(294, 10, 46, '2024-06-30', 'Late'),
(295, 10, 47, '2024-06-30', 'Present'),
(296, 10, 48, '2024-06-30', 'Absent'),
(297, 10, 49, '2024-06-30', 'Present'),
(298, 10, 50, '2024-06-30', 'Present'),
(299, 10, 51, '2024-06-30', 'Late'),
(300, 10, 52, '2024-06-30', 'Present'),
(301, 10, 43, '2024-07-01', 'Present'),
(302, 10, 44, '2024-07-01', 'Absent'),
(303, 10, 45, '2024-07-01', 'Present'),
(304, 10, 46, '2024-07-01', 'Present'),
(305, 10, 47, '2024-07-01', 'Late'),
(306, 10, 48, '2024-07-01', 'Absent'),
(307, 10, 49, '2024-07-01', 'Present'),
(308, 10, 50, '2024-07-01', 'Present'),
(309, 10, 51, '2024-07-01', 'Late'),
(310, 10, 52, '2024-07-01', 'Late'),
(311, 10, 43, '2024-07-02', 'Present'),
(312, 10, 44, '2024-07-02', 'Absent'),
(313, 10, 45, '2024-07-02', 'Present'),
(314, 10, 46, '2024-07-02', 'Late'),
(315, 10, 47, '2024-07-02', 'Present'),
(316, 10, 48, '2024-07-02', 'Absent'),
(317, 10, 49, '2024-07-02', 'Present'),
(318, 10, 50, '2024-07-02', 'Present'),
(319, 10, 51, '2024-07-02', 'Late'),
(320, 10, 52, '2024-07-02', 'Present'),
(321, 10, 43, '2024-07-03', 'Late'),
(322, 10, 44, '2024-07-03', 'Present'),
(323, 10, 45, '2024-07-03', 'Absent'),
(324, 10, 46, '2024-07-03', 'Present'),
(325, 10, 47, '2024-07-03', 'Present'),
(326, 10, 48, '2024-07-03', 'Present'),
(327, 10, 49, '2024-07-03', 'Absent'),
(328, 10, 50, '2024-07-03', 'Present'),
(329, 10, 51, '2024-07-03', 'Present'),
(330, 10, 52, '2024-07-03', 'Late'),
(331, 10, 43, '2024-07-04', 'Present'),
(332, 10, 44, '2024-07-04', 'Present'),
(333, 10, 45, '2024-07-04', 'Present'),
(334, 10, 46, '2024-07-04', 'Present'),
(335, 10, 47, '2024-07-04', 'Present'),
(336, 10, 48, '2024-07-04', 'Present'),
(337, 10, 49, '2024-07-04', 'Present'),
(338, 10, 50, '2024-07-04', 'Present'),
(339, 10, 51, '2024-07-04', 'Present'),
(340, 10, 52, '2024-07-04', 'Present'),
(341, 10, 43, '2024-07-05', 'Absent'),
(342, 10, 44, '2024-07-05', 'Present'),
(343, 10, 45, '2024-07-05', 'Present'),
(344, 10, 46, '2024-07-05', 'Late'),
(345, 10, 47, '2024-07-05', 'Present'),
(346, 10, 48, '2024-07-05', 'Absent'),
(347, 10, 49, '2024-07-05', 'Present'),
(348, 10, 50, '2024-07-05', 'Present'),
(349, 10, 51, '2024-07-05', 'Absent'),
(350, 10, 52, '2024-07-05', 'Present'),
(351, 10, 43, '2024-07-06', 'Present'),
(352, 10, 44, '2024-07-06', 'Absent'),
(353, 10, 45, '2024-07-06', 'Present'),
(354, 10, 46, '2024-07-06', 'Present'),
(355, 10, 47, '2024-07-06', 'Late'),
(356, 10, 48, '2024-07-06', 'Present'),
(357, 10, 49, '2024-07-06', 'Present'),
(358, 10, 50, '2024-07-06', 'Absent'),
(359, 10, 51, '2024-07-06', 'Present'),
(360, 10, 52, '2024-07-06', 'Present'),
(361, 10, 43, '2024-07-07', 'Present'),
(362, 10, 44, '2024-07-07', 'Absent'),
(363, 10, 45, '2024-07-07', 'Present'),
(364, 10, 46, '2024-07-07', 'Late'),
(365, 10, 47, '2024-07-07', 'Absent'),
(366, 10, 48, '2024-07-07', 'Present'),
(367, 10, 49, '2024-07-07', 'Present'),
(368, 10, 50, '2024-07-07', 'Present'),
(369, 10, 51, '2024-07-07', 'Absent'),
(370, 10, 52, '2024-07-07', 'Present'),
(371, 10, 43, '2024-07-08', 'Present'),
(372, 10, 44, '2024-07-08', 'Present'),
(373, 10, 45, '2024-07-08', 'Present'),
(374, 10, 46, '2024-07-08', 'Present'),
(375, 10, 47, '2024-07-08', 'Present'),
(376, 10, 48, '2024-07-08', 'Present'),
(377, 10, 49, '2024-07-08', 'Present'),
(378, 10, 50, '2024-07-08', 'Present'),
(379, 10, 51, '2024-07-08', 'Present'),
(380, 10, 52, '2024-07-08', 'Present'),
(381, 10, 43, '2024-07-09', 'Absent'),
(382, 10, 44, '2024-07-09', 'Present'),
(383, 10, 45, '2024-07-09', 'Present'),
(384, 10, 46, '2024-07-09', 'Late'),
(385, 10, 47, '2024-07-09', 'Present'),
(386, 10, 48, '2024-07-09', 'Present'),
(387, 10, 49, '2024-07-09', 'Absent'),
(388, 10, 50, '2024-07-09', 'Present'),
(389, 10, 51, '2024-07-09', 'Present'),
(390, 10, 52, '2024-07-09', 'Late'),
(391, 10, 43, '2024-07-10', 'Present'),
(392, 10, 44, '2024-07-10', 'Absent'),
(393, 10, 45, '2024-07-10', 'Present'),
(394, 10, 46, '2024-07-10', 'Present'),
(395, 10, 47, '2024-07-10', 'Absent'),
(396, 10, 48, '2024-07-10', 'Present'),
(397, 10, 49, '2024-07-10', 'Present'),
(398, 10, 50, '2024-07-10', 'Late'),
(399, 10, 51, '2024-07-10', 'Present'),
(400, 10, 52, '2024-07-10', 'Absent'),
(401, 10, 43, '2024-07-11', 'Present'),
(402, 10, 44, '2024-07-11', 'Absent'),
(403, 10, 45, '2024-07-11', 'Present'),
(404, 10, 46, '2024-07-11', 'Present'),
(405, 10, 47, '2024-07-11', 'Present'),
(406, 10, 48, '2024-07-11', 'Present'),
(407, 10, 49, '2024-07-11', 'Absent'),
(408, 10, 50, '2024-07-11', 'Present'),
(409, 10, 51, '2024-07-11', 'Present'),
(410, 10, 52, '2024-07-11', 'Late'),
(411, 10, 43, '2024-07-12', 'Present'),
(412, 10, 44, '2024-07-12', 'Present'),
(413, 10, 45, '2024-07-12', 'Absent'),
(414, 10, 46, '2024-07-12', 'Present'),
(415, 10, 47, '2024-07-12', 'Present'),
(416, 10, 48, '2024-07-12', 'Absent'),
(417, 10, 49, '2024-07-12', 'Present'),
(418, 10, 50, '2024-07-12', 'Present'),
(419, 10, 51, '2024-07-12', 'Absent'),
(420, 10, 52, '2024-07-12', 'Present'),
(421, 10, 43, '2024-07-13', 'Present'),
(422, 10, 44, '2024-07-13', 'Present'),
(423, 10, 45, '2024-07-13', 'Present'),
(424, 10, 46, '2024-07-13', 'Present'),
(425, 10, 47, '2024-07-13', 'Present'),
(426, 10, 48, '2024-07-13', 'Present'),
(427, 10, 49, '2024-07-13', 'Present'),
(428, 10, 50, '2024-07-13', 'Present'),
(429, 10, 51, '2024-07-13', 'Present'),
(430, 10, 52, '2024-07-13', 'Present'),
(431, 10, 43, '2024-07-14', 'Absent'),
(432, 10, 44, '2024-07-14', 'Absent'),
(433, 10, 45, '2024-07-14', 'Present'),
(434, 10, 46, '2024-07-14', 'Present'),
(435, 10, 47, '2024-07-14', 'Absent'),
(436, 10, 48, '2024-07-14', 'Absent'),
(437, 10, 49, '2024-07-14', 'Present'),
(438, 10, 50, '2024-07-14', 'Absent'),
(439, 10, 51, '2024-07-14', 'Absent'),
(440, 10, 52, '2024-07-14', 'Present'),
(441, 10, 43, '2024-07-15', 'Present'),
(442, 10, 44, '2024-07-15', 'Present'),
(443, 10, 45, '2024-07-15', 'Present'),
(444, 10, 46, '2024-07-15', 'Present'),
(445, 10, 47, '2024-07-15', 'Present'),
(446, 10, 48, '2024-07-15', 'Present'),
(447, 10, 49, '2024-07-15', 'Present'),
(448, 10, 50, '2024-07-15', 'Present'),
(449, 10, 51, '2024-07-15', 'Present'),
(450, 10, 52, '2024-07-15', 'Present'),
(451, 10, 43, '2024-07-16', 'Present'),
(452, 10, 44, '2024-07-16', 'Absent'),
(453, 10, 45, '2024-07-16', 'Present'),
(454, 10, 46, '2024-07-16', 'Present'),
(455, 10, 47, '2024-07-16', 'Absent'),
(456, 10, 48, '2024-07-16', 'Present'),
(457, 10, 49, '2024-07-16', 'Absent'),
(458, 10, 50, '2024-07-16', 'Present'),
(459, 10, 51, '2024-07-16', 'Present'),
(460, 10, 52, '2024-07-16', 'Absent'),
(461, 10, 43, '2024-07-17', 'Present'),
(462, 10, 44, '2024-07-17', 'Present'),
(463, 10, 45, '2024-07-17', 'Present'),
(464, 10, 46, '2024-07-17', 'Present'),
(465, 10, 47, '2024-07-17', 'Absent'),
(466, 10, 48, '2024-07-17', 'Present'),
(467, 10, 49, '2024-07-17', 'Absent'),
(468, 10, 50, '2024-07-17', 'Present'),
(469, 10, 51, '2024-07-17', 'Present'),
(470, 10, 52, '2024-07-17', 'Present'),
(471, 10, 43, '2024-07-18', 'Absent'),
(472, 10, 44, '2024-07-18', 'Absent'),
(473, 10, 45, '2024-07-18', 'Present'),
(474, 10, 46, '2024-07-18', 'Present'),
(475, 10, 47, '2024-07-18', 'Present'),
(476, 10, 48, '2024-07-18', 'Absent'),
(477, 10, 49, '2024-07-18', 'Present'),
(478, 10, 50, '2024-07-18', 'Present'),
(479, 10, 51, '2024-07-18', 'Absent'),
(480, 10, 52, '2024-07-18', 'Absent'),
(481, 10, 43, '2024-07-19', 'Present'),
(482, 10, 44, '2024-07-19', 'Absent'),
(483, 10, 45, '2024-07-19', 'Present'),
(484, 10, 46, '2024-07-19', 'Late'),
(485, 10, 47, '2024-07-19', 'Present'),
(486, 10, 48, '2024-07-19', 'Absent'),
(487, 10, 49, '2024-07-19', 'Present'),
(488, 10, 50, '2024-07-19', 'Present'),
(489, 10, 51, '2024-07-19', 'Absent'),
(490, 10, 52, '2024-07-19', 'Present'),
(491, 10, 43, '2024-07-20', 'Present'),
(492, 10, 44, '2024-07-20', 'Present'),
(493, 10, 45, '2024-07-20', 'Present'),
(494, 10, 46, '2024-07-20', 'Absent'),
(495, 10, 47, '2024-07-20', 'Present'),
(496, 10, 48, '2024-07-20', 'Absent'),
(497, 10, 49, '2024-07-20', 'Present'),
(498, 10, 50, '2024-07-20', 'Present'),
(499, 10, 51, '2024-07-20', 'Present'),
(500, 10, 52, '2024-07-20', 'Absent'),
(501, 10, 43, '2024-07-21', 'Present'),
(502, 10, 44, '2024-07-21', 'Present'),
(503, 10, 45, '2024-07-21', 'Absent'),
(504, 10, 46, '2024-07-21', 'Present'),
(505, 10, 47, '2024-07-21', 'Absent'),
(506, 10, 48, '2024-07-21', 'Present'),
(507, 10, 49, '2024-07-21', 'Present'),
(508, 10, 50, '2024-07-21', 'Absent'),
(509, 10, 51, '2024-07-21', 'Present'),
(510, 10, 52, '2024-07-21', 'Present'),
(511, 10, 43, '2024-07-22', 'Present'),
(512, 10, 44, '2024-07-22', 'Present'),
(513, 10, 45, '2024-07-22', 'Absent'),
(514, 10, 46, '2024-07-22', 'Present'),
(515, 10, 47, '2024-07-22', 'Absent'),
(516, 10, 48, '2024-07-22', 'Present'),
(517, 10, 49, '2024-07-22', 'Present'),
(518, 10, 50, '2024-07-22', 'Absent'),
(519, 10, 51, '2024-07-22', 'Present'),
(520, 10, 52, '2024-07-22', 'Present'),
(521, 10, 43, '2024-07-23', 'Absent'),
(522, 10, 44, '2024-07-23', 'Absent'),
(523, 10, 45, '2024-07-23', 'Present'),
(524, 10, 46, '2024-07-23', 'Present'),
(525, 10, 47, '2024-07-23', 'Absent'),
(526, 10, 48, '2024-07-23', 'Absent'),
(527, 10, 49, '2024-07-23', 'Present'),
(528, 10, 50, '2024-07-23', 'Absent'),
(529, 10, 51, '2024-07-23', 'Absent'),
(530, 10, 52, '2024-07-23', 'Present'),
(531, 10, 43, '2024-07-24', 'Present'),
(532, 10, 44, '2024-07-24', 'Present'),
(533, 10, 45, '2024-07-24', 'Present'),
(534, 10, 46, '2024-07-24', 'Present'),
(535, 10, 47, '2024-07-24', 'Present'),
(536, 10, 48, '2024-07-24', 'Present'),
(537, 10, 49, '2024-07-24', 'Present'),
(538, 10, 50, '2024-07-24', 'Present'),
(539, 10, 51, '2024-07-24', 'Present'),
(540, 10, 52, '2024-07-24', 'Present'),
(541, 10, 43, '2024-07-25', 'Absent'),
(542, 10, 44, '2024-07-25', 'Present'),
(543, 10, 45, '2024-07-25', 'Present'),
(544, 10, 46, '2024-07-25', 'Absent'),
(545, 10, 47, '2024-07-25', 'Present'),
(546, 10, 48, '2024-07-25', 'Absent'),
(547, 10, 49, '2024-07-25', 'Present'),
(548, 10, 50, '2024-07-25', 'Present'),
(549, 10, 51, '2024-07-25', 'Absent'),
(550, 10, 52, '2024-07-25', 'Present'),
(551, 10, 43, '2024-07-26', 'Present'),
(552, 10, 44, '2024-07-26', 'Present'),
(553, 10, 45, '2024-07-26', 'Absent'),
(554, 10, 46, '2024-07-26', 'Present'),
(555, 10, 47, '2024-07-26', 'Present'),
(556, 10, 48, '2024-07-26', 'Absent'),
(557, 10, 49, '2024-07-26', 'Present'),
(558, 10, 50, '2024-07-26', 'Present'),
(559, 10, 51, '2024-07-26', 'Absent'),
(560, 10, 52, '2024-07-26', 'Present'),
(561, 10, 43, '2024-07-27', 'Present'),
(562, 10, 44, '2024-07-27', 'Absent'),
(563, 10, 45, '2024-07-27', 'Present'),
(564, 10, 46, '2024-07-27', 'Absent'),
(565, 10, 47, '2024-07-27', 'Present'),
(566, 10, 48, '2024-07-27', 'Absent'),
(567, 10, 49, '2024-07-27', 'Present'),
(568, 10, 50, '2024-07-27', 'Absent'),
(569, 10, 51, '2024-07-27', 'Present'),
(570, 10, 52, '2024-07-27', 'Present'),
(571, 10, 43, '2024-07-28', 'Absent'),
(572, 10, 44, '2024-07-28', 'Absent'),
(573, 10, 45, '2024-07-28', 'Present'),
(574, 10, 46, '2024-07-28', 'Present'),
(575, 10, 47, '2024-07-28', 'Absent'),
(576, 10, 48, '2024-07-28', 'Absent'),
(577, 10, 49, '2024-07-28', 'Present'),
(578, 10, 50, '2024-07-28', 'Absent'),
(579, 10, 51, '2024-07-28', 'Absent'),
(580, 10, 52, '2024-07-28', 'Present'),
(581, 10, 43, '2024-07-29', 'Present'),
(582, 10, 44, '2024-07-29', 'Present'),
(583, 10, 45, '2024-07-29', 'Present'),
(584, 10, 46, '2024-07-29', 'Present'),
(585, 10, 47, '2024-07-29', 'Present'),
(586, 10, 48, '2024-07-29', 'Present'),
(587, 10, 49, '2024-07-29', 'Present'),
(588, 10, 50, '2024-07-29', 'Present'),
(589, 10, 51, '2024-07-29', 'Present'),
(590, 10, 52, '2024-07-29', 'Present'),
(591, 10, 43, '2024-07-30', 'Present'),
(592, 10, 44, '2024-07-30', 'Absent'),
(593, 10, 45, '2024-07-30', 'Present'),
(594, 10, 46, '2024-07-30', 'Absent'),
(595, 10, 47, '2024-07-30', 'Present'),
(596, 10, 48, '2024-07-30', 'Absent'),
(597, 10, 49, '2024-07-30', 'Present'),
(598, 10, 50, '2024-07-30', 'Absent'),
(599, 10, 51, '2024-07-30', 'Present'),
(600, 10, 52, '2024-07-30', 'Absent'),
(601, 10, 43, '2024-07-31', 'Present'),
(602, 10, 44, '2024-07-31', 'Present'),
(603, 10, 45, '2024-07-31', 'Present'),
(604, 10, 46, '2024-07-31', 'Absent'),
(605, 10, 47, '2024-07-31', 'Present'),
(606, 10, 48, '2024-07-31', 'Absent'),
(607, 10, 49, '2024-07-31', 'Present'),
(608, 10, 50, '2024-07-31', 'Present'),
(609, 10, 51, '2024-07-31', 'Present'),
(610, 10, 52, '2024-07-31', 'Absent'),
(611, 10, 43, '2024-08-01', 'Present'),
(612, 10, 44, '2024-08-01', 'Absent'),
(613, 10, 45, '2024-08-01', 'Present'),
(614, 10, 46, '2024-08-01', 'Present'),
(615, 10, 47, '2024-08-01', 'Absent'),
(616, 10, 48, '2024-08-01', 'Present'),
(617, 10, 49, '2024-08-01', 'Absent'),
(618, 10, 50, '2024-08-01', 'Present'),
(619, 10, 51, '2024-08-01', 'Present'),
(620, 10, 52, '2024-08-01', 'Absent');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `studentID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gender` varchar(250) NOT NULL,
  `profile_pic` varchar(100) NOT NULL,
  `teacher_Id` int(11) NOT NULL,
  `gmail` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`studentID`, `name`, `gender`, `profile_pic`, `teacher_Id`, `gmail`) VALUES
(43, 'Luzviminda Reyes', 'Female', 'Luzviminda .jpg', 10, 'luzvimindareyes@gmail.com'),
(44, 'Amihan dela Cruz', 'Female', 'Amihan dela Cruz.jpg', 10, 'amihandelacruz@gmail.com'),
(45, 'Ligaya Mendoza', 'Female', 'Ligaya.jpg', 10, 'ligayamendoza@gmail.com'),
(46, 'Jose Aquino', 'Male', 'Jose.jpg', 10, 'joseaquino@gmail.com'),
(47, 'Andres Alvarez', 'Male', 'Andres .jpg', 10, 'andresalvarez@gmail.com'),
(48, 'Manuel Rodriguez ', 'Male', 'Manuel.jpg', 10, 'manuelrodriguez@gmail.com'),
(49, 'Benedicto Flores', 'Male', 'Benedicto.jpg', 10, 'benedictoflores@gmail.com'),
(50, 'Lakandula Alvarez', 'Male', 'Lakandula.jpg', 10, 'lakandulaalvarez@gmail.com'),
(51, 'changli', 'Female', 'changli.jpg', 10, 'changli@gmail.com'),
(52, 'Haerin', 'Female', 'Haerin.jpg', 10, 'haerin@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `profile_pic` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `profile_pic`) VALUES
(1, 'Eloisa', 'Cabuen', '21-70803@g.batstate-u.edu.ph', '$2a$08$E8RriSg2dt0mJBjsW7AH3ub/is7bJtRCKQzrzkvMLmEh2rod3NlZ2', ''),
(2, 'raica', 'perez', 'raica@gmail. com', '$2a$08$ppUgxwCnld.PeXWuZsI4C.7w.ui34yW8asn62UqJhrCnigm/qHie.', ''),
(3, 'Arvin', 'Butiong', '21-78006@g.batstate-u.edu.ph', '$2a$08$xzmCW8w/Iewg3Y9KXl3PO.gMxkd6AwDKhQbFD4aGmgvwN9/TKviJ2', ''),
(5, 'Raica Kathleen', 'Perez', 'raicsp', '$2a$08$ut4CUTZLn5pR94n62OcoSOcSQIn2C1mlybjd8OuWHc3q7qA2YTiFG', ''),
(6, 'Jennie', 'Kim', 'jennie', '$2a$08$TxtlmGSE0NgbV5I3wQLzTulpSojnSBUQpbhf9gU6Zyniaepd2aPyC', ''),
(7, 'Raica', 'Perez', 'perezkatheen33@gmail.com ', '$2a$08$vK4Gr3u3MH1matuxP3jwAuQCaS7Cme..e.YvbyOFhL4Cdxm/Wpd/C', 'Raica-Perez.jpg'),
(8, 'rica', 'perez', 'rica', '$2b$08$TdtbJrnZiycCnI/UjIe.MuSYFJC8g6VUTZ3ZvIdOocm4CH6WwmXsS', ''),
(9, 'Jennie', 'Kim', 'b', '$2b$08$gkCcOPsB0.iDxSBe4Y0Z/uiOZzbX4Qn8np78fOHPl.jSGzqz1Od3O', ''),
(10, 'Raiiiii', 'Perezz', 'raicaperez@gmail.com', '$2b$08$ULpudpS8LovdKa9VaWkNTuEeunP/7OHXiA48jQNvdDIz9YzUb3rFi', 'Raiiiii-Perezz.jpg'),
(11, 'Raics', 'P', 'A', '$2b$08$di/eIjq4TRXMg4k/JkhNGunQk.OYGtl5.6NXKNDwVTJxNPn.JGWt.', 'Raics-P.jpg'),
(12, 'B', 'B', 'B', '$2b$08$F31z217xcmci69Twp6g1gu3ibJkyK3oC5zvFL6HEkKNkaP2GC0Z8W', ''),
(13, 'gsgs', 'hshsh', 'perez@gmail.com', '$2b$08$D9OqjBOFuOSJdd9Cwj.zmuEjUIePo2s56K//53clKIkuz/rXUQX6O', ''),
(14, 'hshs', 'gshs', 'peredz@gmail.com', '$2b$08$po5Yd5tHSwrja7n9rYdy/u.EBdLD83F4rH/R.qJ6rqh.TbF.DHLe6', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendanceID`),
  ADD KEY `fk_studentID` (`studentID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`studentID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `studentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_studentID` FOREIGN KEY (`studentID`) REFERENCES `student` (`studentID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
