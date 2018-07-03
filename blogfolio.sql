-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2018 at 03:59 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blogfolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`, `status`) VALUES
(1, 'sakshi@gmail.com', '456', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

CREATE TABLE `blog` (
  `blog_id` int(11) NOT NULL,
  `blog_title` varchar(100) DEFAULT NULL,
  `blog_date` varchar(100) DEFAULT NULL,
  `blog_author` varchar(100) DEFAULT NULL,
  `blog_img` varchar(100) DEFAULT NULL,
  `blog_description` varchar(100) DEFAULT NULL,
  `blog_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blog`
--

INSERT INTO `blog` (`blog_id`, `blog_title`, `blog_date`, `blog_author`, `blog_img`, `blog_description`, `blog_status`) VALUES
(1, 'The First Day of Their Lives', ' Feb 27, 2018 at 6:53 pm', 'Cindy Jefferson', '/static/post-1.jpg', 'Lorem ipsum dolor sit amet, consecteturs, blandit maximus augue magna accumsan ante. Aliquam bibendu', 'active'),
(2, 'Happily Ever after or Yes! I Will', ' Feb 28, 2018 at 6:53 pm', 'Cindy Jefferson', '/static/post-003.jpg', 'Lorem ipsum dogue magna accumsan ante. Aliquam bibendum lacus quis nulla dignissim faucibus. Sed mau', 'active'),
(3, 'Top Wed Bakers in Your Area', ' Feb 9, 2018', 'Cindy Jefferson', '/static/post-005.jpg', 'Lorem ipsum dolor sit amet, consecteturs, blandit maximus augue magna accumsan ante. Aliquam bibendu', 'active'),
(4, 'Special Treats for the Guests', ' Feb 9, 2018', 'Cindy Jefferson', '/static/post-008.jpg', 'Lorem ipsum dolor sit amet, consecteturs, blandit maximus augue magna accumsan ante. Aliquam bibendu', 'active'),
(5, 'Beautiful Landscapes for Ceremonies', ' Feb 28, 2018 at 6:53 pm', 'Cindy Jefferson', '/static/post-012.jpg', 'Lorem ipsum dolor sit amet, consecteturs, blandit maximus auguesit amet feugiat lorem. Curabitur sed', 'active'),
(6, 'Exotic Flowers and Elements of Decor', ' Jan 27, 2018', 'Cindy Jefferson', '/static/post-6.jpg', 'Lorem ipsum dogue magna accumsan ante. Aliquam bibendum lacus quis nulla dignissim faucibus. Sed mau', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_firstname` varchar(100) NOT NULL,
  `user_lastname` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(100) NOT NULL,
  `user_status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`blog_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blog`
--
ALTER TABLE `blog`
  MODIFY `blog_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
