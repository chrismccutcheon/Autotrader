module.exports = function(sequelize, DataTypes) {
	return sequelize.define('stock', {
		symbol: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 6]
			}
		},
		quantity:{
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1
			}
		},
		initialInvestment:{
			type: DataTypes.DOUBLE,
			allowNull: true
		}
	});
};
