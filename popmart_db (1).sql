-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 17, 2026 at 06:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `popmart_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`) VALUES
(83, 5, 14, 1, '2026-01-15 19:21:04'),
(164, 4, 18, 1, '2026-01-17 09:47:44');

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `series` varchar(100) DEFAULT NULL,
  `rarity` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `model_url` varchar(255) DEFAULT NULL,
  `card_color` varchar(50) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `name`, `series`, `rarity`, `image_url`, `model_url`, `card_color`, `display_order`, `created_at`) VALUES
(13, 'LABUBU', 'MAGARET', 'Legendary', NULL, '/uploads/models/1768654890288-molly_the_duck.glb', 'bg-pink-100', 0, '2026-01-17 13:01:31');

-- --------------------------------------------------------

--
-- Table structure for table `flash_sale_campaigns`
--

CREATE TABLE `flash_sale_campaigns` (
  `id` int(11) NOT NULL,
  `campaign_name` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flash_sale_campaigns`
--

INSERT INTO `flash_sale_campaigns` (`id`, `campaign_name`, `start_time`, `end_time`, `is_active`, `created_at`) VALUES
(1, 'Dara', '2026-01-15 22:12:32', '2026-01-18 23:35:00', 1, '2026-01-15 15:12:32');

-- --------------------------------------------------------

--
-- Table structure for table `flash_sale_items`
--

CREATE TABLE `flash_sale_items` (
  `id` int(11) NOT NULL,
  `campaign_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `flash_price` decimal(10,2) NOT NULL,
  `flash_stock` int(11) NOT NULL,
  `sold_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flash_sale_items`
--

INSERT INTO `flash_sale_items` (`id`, `campaign_id`, `product_id`, `flash_price`, `flash_stock`, `sold_count`, `created_at`) VALUES
(9, NULL, 18, 300.00, 2, 0, '2026-01-17 09:45:03'),
(10, NULL, 17, 150.00, 1, 0, '2026-01-17 14:08:04'),
(11, NULL, 16, 20.00, 5, 0, '2026-01-17 14:14:44');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','on_delivery','completed','received') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `slip_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tracking_number` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `payment_method`, `slip_url`, `created_at`, `tracking_number`) VALUES
(27, 1, 1.00, 'completed', 'promptpay', '/uploads/slips/1768652766422-dashboard.png', '2026-01-17 12:26:06', '158799542'),
(29, 1, 300.00, 'completed', 'promptpay', '/uploads/slips/1768653499946-dashboard.png', '2026-01-17 12:38:19', '154786'),
(30, 1, 300.00, 'completed', 'promptpay', '/uploads/slips/1768653683457-plants.png', '2026-01-17 12:41:23', '1587752'),
(31, 1, 300.00, 'completed', 'promptpay', '/uploads/slips/1768657151849-history.png', '2026-01-17 13:39:11', '159757'),
(32, 1, 300.00, 'completed', 'promptpay', '/uploads/slips/1768659434753-logout.png', '2026-01-17 14:17:14', '11584'),
(33, 1, 1150.00, 'completed', 'promptpay', '/uploads/slips/1768667854793-plants.png', '2026-01-17 16:37:34', '15442454174');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price_at_purchase`) VALUES
(28, 27, 14, 1, 1.00),
(30, 29, 18, 1, 300.00),
(31, 30, 18, 1, 300.00),
(32, 31, 18, 1, 300.00),
(33, 32, 18, 1, 300.00),
(34, 33, 20, 1, 1150.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `series` varchar(100) DEFAULT NULL,
  `rarity` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `series`, `rarity`, `stock`, `image_url`, `created_at`) VALUES
(14, 'Duck', 'sadasd', 600.00, 'The Monsters', 'Duckk', 'Common', 5, '/uploads/models/1768666810412-playful_toy_cartoon_character_illustration_car.glb', '2026-01-15 18:28:50'),
(15, 'Habubu', 'sdad', 500.00, 'labubu', 'HAHA', 'Common', 20, '/uploads/models/1768666683193-habubulabubu_imp_stylized_toy_creature_3d.glb', '2026-01-15 18:45:12'),
(16, 'Stuffed Bunny', 'shdgah', 400.00, 'Skullpanda', '์NATAN', 'Rare', 6, '/uploads/models/1768666627207-cute_stuffed_bunny_toy.glb', '2026-01-15 19:22:14'),
(17, 'labubu', 'jsdhsjjsdghj', 450.00, 'labubu', 'MONINT', 'Secret', 5, '/uploads/models/1768666548468-secret-_labubu.glb', '2026-01-16 09:45:50'),
(18, 'cartoontoycar', 'jsdhsjjsdghj', 700.00, 'The Monsters', 'MAGARED', 'Secret', 5, '/uploads/models/1768666393933-cartoon_toy_car_character_illustration.glb', '2026-01-16 09:45:50'),
(19, 'LABUBU', '', 850.00, 'labubu', 'ThreKO', 'Common', 9, '/uploads/models/1768666850665-labubu_coffee_creature__stylized_toy_figure_3d.glb', '2026-01-17 16:20:51'),
(20, 'Purple', '', 1150.00, 'The Monsters', 'PEDE', 'Common', 7, '/uploads/models/1768667446861-purple_gesture_art_doll_an_animated_cartoon_toy.glb', '2026-01-17 16:30:07');

-- --------------------------------------------------------

--
-- Table structure for table `shipping_details`
--

CREATE TABLE `shipping_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_details`
--

INSERT INTO `shipping_details` (`id`, `order_id`, `first_name`, `last_name`, `email`, `phone`, `address`, `district`, `province`, `zip_code`) VALUES
(27, 27, 'kantapong', 'nilakan', 'aodpsd@dasad', '0801240018', '56/0', 'asd', 'spdka', '83110'),
(29, 29, 'kantapong', 'nilakan', 'aodpsd@dasad', '0801240018', '56/0', 'asd', 'spdka', '83110'),
(30, 30, 'kantapong', 'nilakan', 'aodpsd@dasad', '0801240018', '56/0', 'asd', 'spdka', '83110'),
(31, 31, 'kantapong', 'nilakan', 'aodpsd@dasad', '0801240018', '56/0', 'asd', 'spdka', '83110'),
(32, 32, 'kantapong', 'nilakan', 'aodpsd@dasad', '0801240018', '56/0', 'asd', 'spdka', '83110'),
(33, 33, 'kantapong', 'nilakan', 'aodpsd@dasad', '0801240018', '56/0', 'asd', 'spdka', '83110');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('member','admin') DEFAULT 'member',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'กันตพงศื ', 'kantapongnilakan@gmail.com', 'Guns302546', 'admin', '2026-01-14 15:21:26'),
(2, 'admin', 'admin@gmail.com', 'admin', 'member', '2026-01-14 17:47:17'),
(4, 'tase', 'tast@gmail.com', 'tase', 'member', '2026-01-14 19:17:19'),
(5, 'kutod', 'kantapong@gmail.com', 'Guns302546', '', '2026-01-15 19:20:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `flash_sale_campaigns`
--
ALTER TABLE `flash_sale_campaigns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `flash_sale_items`
--
ALTER TABLE `flash_sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campaign_id` (`campaign_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shipping_details`
--
ALTER TABLE `shipping_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=194;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `flash_sale_campaigns`
--
ALTER TABLE `flash_sale_campaigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `flash_sale_items`
--
ALTER TABLE `flash_sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `shipping_details`
--
ALTER TABLE `shipping_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `flash_sale_items`
--
ALTER TABLE `flash_sale_items`
  ADD CONSTRAINT `flash_sale_items_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `flash_sale_campaigns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `flash_sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `shipping_details`
--
ALTER TABLE `shipping_details`
  ADD CONSTRAINT `shipping_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
