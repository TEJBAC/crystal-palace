// migrations/YYYYMMDDHHMMSS-add-columns-to-booking.js

'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Bookings', 'name', {
    type: Sequelize.STRING,
    allowNull: false
  });
  await queryInterface.addColumn('Bookings', 'phone_no', {
    type: Sequelize.STRING,
    allowNull: false
  });
  await queryInterface.addColumn('Bookings', 'email_id', {
    type: Sequelize.STRING,
    allowNull: false
  });
  await queryInterface.addColumn('Bookings', 'status', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'pending'
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('Bookings', 'name');
  await queryInterface.removeColumn('Bookings', 'phone_no');
  await queryInterface.removeColumn('Bookings', 'email_id');
  await queryInterface.removeColumn('Bookings', 'status');
}
