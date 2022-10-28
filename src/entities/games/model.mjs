import { DataTypes, Model } from 'sequelize';
export default class Games extends Model {
    static init(sequelize) {
        const tableConfig={ 
            sequelize, 
            schema: 'public',
            modelName: 'games',
            underscored:true
        }
        const tableDefinition={
            name:{
                type:DataTypes.STRING,
                unique:true,
                allowNull: false
            },
            publisher:{
                type:DataTypes.STRING,
                allowNull: false
            },
        }
        super.init(tableDefinition,tableConfig)
    }
    
    static associate(models) {
        this.hasOne(models.games_collection,{foreignKey:'id_game'})
    }
}