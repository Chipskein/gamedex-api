import { DataTypes, Model } from 'sequelize';
export default class Stars extends Model {
    static init(sequelize) {
        const tableConfig={ 
            sequelize, 
            schema: 'public',
            modelName: 'stars',
            underscored:true
        }
        const tableDefinition={
     
        }
        super.init(tableDefinition,tableConfig)
    }
    
    static associate(models) {
        this.belongsTo(models.users,{foreignKey:'id_user',foreignKeyConstraint:true,})
        this.belongsTo(models.games_collection,{foreignKey:'id_games_collection',foreignKeyConstraint:true,})
    }
}