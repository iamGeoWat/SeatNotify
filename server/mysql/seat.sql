/*
 Navicat MySQL Data Transfer

 Source Server         : Seat
 Source Server Type    : MySQL
 Source Server Version : 50719
 Source Host           : localhost:3306
 Source Schema         : seat

 Target Server Type    : MySQL
 Target Server Version : 50719
 File Encoding         : 65001

 Date: 28/02/2020 22:25:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for subscription
-- ----------------------------
DROP TABLE IF EXISTS `subscription`;
CREATE TABLE `subscription` (
  `sub_id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(100) NOT NULL,
  `city` varchar(10) NOT NULL,
  `date` varchar(20) NOT NULL,
  `notified` int(1) NOT NULL,
  `cancelled` int(1) NOT NULL,
  `has_seat` int(1) NOT NULL,
  PRIMARY KEY (`sub_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
