module.exports = function(sequelize, DataTypes) {
	return sequelize.define('stock', {
		symbol: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 6]
			}
		}
	});
};
