-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2024 at 11:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eight_squirfit`
--

-- --------------------------------------------------------

--
-- Table structure for table `rent_agriment_enquiry`
--

CREATE TABLE `rent_agriment_enquiry` (
  `id` int(11) NOT NULL,
  `ref_dipo_amt` int(11) NOT NULL COMMENT 'refendable diposite amount',
  `agri_durr` varchar(50) NOT NULL COMMENT 'agriment duration',
  `mnth_rent_amt` int(11) NOT NULL COMMENT 'monthly rent amount',
  `rent_not_fix` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `inc_by_amt_from` int(11) NOT NULL COMMENT 'amt_increment_from_month',
  `inc_amt_to` int(11) NOT NULL COMMENT 'incriment by amount to month',
  `inc_by_per_month` int(11) NOT NULL COMMENT 'incriment by percentage every month',
  `inc_by_per_to_percent` int(11) NOT NULL COMMENT 'incremenrt by percentage for percentage',
  `non_ref_deposit` bigint(11) NOT NULL COMMENT 'non refundable deposit',
  `agriment_date` varchar(50) NOT NULL COMMENT 'agriment_date',
  `agriment_type` varchar(50) NOT NULL COMMENT 'agreement by: Owner, Tenent',
  `min_lokin_period` int(11) NOT NULL COMMENT 'lockin period for the agriment',
  `deposit_payment_mode` varchar(50) NOT NULL COMMENT 'deposit payment mode',
  `reg_fee_paid_by` varchar(50) NOT NULL COMMENT 'who paid the stap duty, reg fee',
  `mentenence_paid_by` varchar(50) NOT NULL COMMENT 'maintenance paid by',
  `amenities` text NOT NULL COMMENT 'Amenities',
  `misc_clause_desc` text NOT NULL COMMENT 'misclinious clause description',
  `printing_cleaning_charges` enum('0','1') NOT NULL COMMENT '0:No,1:Yes',
  `property_cond_upo_vac` enum('0','1') NOT NULL COMMENT '0:No,1:Yes',
  `property_type` varchar(255) NOT NULL,
  `flour_num` int(11) NOT NULL,
  `flat_number` varchar(20) NOT NULL,
  `building_name` varchar(100) NOT NULL,
  `locality` varchar(100) NOT NULL,
  `road_street` varchar(100) NOT NULL,
  `society_name` varchar(100) NOT NULL,
  `pincode` int(11) NOT NULL,
  `distric` varchar(100) NOT NULL,
  `tahasil` varchar(100) NOT NULL,
  `village_city` varchar(100) NOT NULL,
  `property_num_type` varchar(100) NOT NULL,
  `property_number` int(11) NOT NULL,
  `builtup_area_house` int(11) NOT NULL,
  `builtup_area_unit` varchar(100) NOT NULL COMMENT 'squirfeet/area/heactor',
  `use_of_area` varchar(50) NOT NULL COMMENT 'Recedentail, nonrecedentail',
  `parking_area` int(11) NOT NULL,
  `parking_area_unit` varchar(50) NOT NULL,
  `gallery_area` varchar(50) NOT NULL,
  `gallery_area_unit` varchar(50) NOT NULL,
  `landloard_entity_type` varchar(100) NOT NULL,
  `landloard_name` varchar(100) NOT NULL,
  `landloard_phone` bigint(11) NOT NULL,
  `have_landloard_aadhar` enum('0','1') NOT NULL,
  `landloard_pan_number` int(11) NOT NULL,
  `landloard_email` varchar(50) NOT NULL,
  `landloard_building_name` varchar(100) NOT NULL,
  `flat_house_no` int(11) NOT NULL,
  `landloard_floor_no` int(11) NOT NULL,
  `landloard_road_street` varchar(100) NOT NULL,
  `landloard_pincode` int(11) NOT NULL,
  `landloard_village_city` varchar(100) NOT NULL,
  `landloard_dist` varchar(50) NOT NULL,
  `landloard_state` varchar(50) NOT NULL,
  `exicuting_through` varchar(100) NOT NULL,
  `tenant_entity_type` varchar(50) NOT NULL,
  `tenant_name` varchar(100) NOT NULL,
  `tanent_phone` int(11) NOT NULL,
  `tanent_adhar_card` enum('0','1') NOT NULL COMMENT '0: No, 1: Yes',
  `tenant_email` varchar(100) NOT NULL,
  `tanent_pan` int(11) NOT NULL,
  `tenant_building_name` varchar(100) NOT NULL,
  `tenant_flat_no` int(11) NOT NULL,
  `tenant_road_street` varchar(50) NOT NULL,
  `tenant_pincode` int(11) NOT NULL,
  `tenant_village_city` varchar(100) NOT NULL,
  `tenant_district` varchar(100) NOT NULL,
  `tenant_state` varchar(100) NOT NULL,
  `tenant_exec_through` varchar(100) NOT NULL,
  `delivery_add_fullname` varchar(100) NOT NULL,
  `delivery_address_email` varchar(100) NOT NULL,
  `delivery_address_phone` bigint(11) NOT NULL,
  `delivery_address_pincode` int(10) NOT NULL,
  `delivery_type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rent_agriment_enquiry`
--

INSERT INTO `rent_agriment_enquiry` (`id`, `ref_dipo_amt`, `agri_durr`, `mnth_rent_amt`, `rent_not_fix`, `inc_by_amt_from`, `inc_amt_to`, `inc_by_per_month`, `inc_by_per_to_percent`, `non_ref_deposit`, `agriment_date`, `agriment_type`, `min_lokin_period`, `deposit_payment_mode`, `reg_fee_paid_by`, `mentenence_paid_by`, `amenities`, `misc_clause_desc`, `printing_cleaning_charges`, `property_cond_upo_vac`, `property_type`, `flour_num`, `flat_number`, `building_name`, `locality`, `road_street`, `society_name`, `pincode`, `distric`, `tahasil`, `village_city`, `property_num_type`, `property_number`, `builtup_area_house`, `builtup_area_unit`, `use_of_area`, `parking_area`, `parking_area_unit`, `gallery_area`, `gallery_area_unit`, `landloard_entity_type`, `landloard_name`, `landloard_phone`, `have_landloard_aadhar`, `landloard_pan_number`, `landloard_email`, `landloard_building_name`, `flat_house_no`, `landloard_floor_no`, `landloard_road_street`, `landloard_pincode`, `landloard_village_city`, `landloard_dist`, `landloard_state`, `exicuting_through`, `tenant_entity_type`, `tenant_name`, `tanent_phone`, `tanent_adhar_card`, `tenant_email`, `tanent_pan`, `tenant_building_name`, `tenant_flat_no`, `tenant_road_street`, `tenant_pincode`, `tenant_village_city`, `tenant_district`, `tenant_state`, `tenant_exec_through`, `delivery_add_fullname`, `delivery_address_email`, `delivery_address_phone`, `delivery_address_pincode`, `delivery_type`) VALUES
(1, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '', '', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier'),
(2, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-02', 'Tenent', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '', '', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith1@example.com', 9876543212, 123456, 'Courier'),
(3, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-03', 'Tenent', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '', '', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith2@example.com', 9876543213, 123456, 'Courier'),
(4, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-04', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '', '', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith3@example.com', 9876543214, 123456, 'Courier'),
(5, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-05', 'Tenent', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith4@example.com', 9876543215, 123456, 'Courier'),
(6, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-06', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith5@example.com', 9876543216, 123456, 'Courier'),
(7, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier'),
(8, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier'),
(9, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier'),
(10, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier'),
(11, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier'),
(12, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier'),
(13, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier'),
(14, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier'),
(15, 50000, '12', 15000, '0', 1000, 2000, 5, 10, 25000, '2024-12-01', 'Owner', 6, 'Bank Transfer', 'Tenant', 'Landlord', 'Pool, Gym, Parking', 'No pets allowed.', '1', '1', 'Apartment', 2, '201', 'Skyline Towers', 'Downtown', 'Main Street', 'Skyline Housing', 123456, 'Metro City', 'Central', 'Metro City', 'Flat', 0, 1200, 'sqft', 'recedentail', 200, 'sqft', '100', 'sqft', 'Individual', 'John Doe', 9876543210, '0', 0, 'john.doe@example.com', 'Skyline Towers', 201, 2, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Individual', 'Jane Smith', 2147483647, '1', 'jane.smith@example.com', 0, 'Skyline Towers', 202, 'Main Street', 123456, 'Metro City', 'Metro City', 'Metro State', 'Self', 'Jane Smith', 'jane.smith@example.com', 9876543211, 123456, 'Courier');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rent_agriment_enquiry`
--
ALTER TABLE `rent_agriment_enquiry`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rent_agriment_enquiry`
--
ALTER TABLE `rent_agriment_enquiry`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
