import { DataTypes, Model } from 'sequelize';
export default class Collections extends Model {
    static init(sequelize) {
        const tableConfig={ 
            sequelize, 
            schema: 'public',
            modelName: 'games_collection',
            underscored:true
        }
        const tableDefinition={
            evidence_img:{
                type:DataTypes.TEXT,
                allowNull: false
            },
        }
        super.init(tableDefinition,tableConfig)
    }
    
    static associate(models) {
        this.belongsTo(models.users,{foreignKey:'id_user',foreignKeyConstraint:true,onDelete:'cascade'})
        this.belongsTo(models.games,{foreignKey:'id_game',foreignKeyConstraint:true,onDelete:'cascade'})
        this.hasOne(models.stars,{foreignKey:'id_games_collection',foreignKeyConstraint:true,})
    }
}