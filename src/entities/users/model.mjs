import { DataTypes, Model } from 'sequelize';
export default class Users extends Model {
    static init(sequelize) {
        const tableConfig={ 
            sequelize, 
            schema: 'public',
            modelName: 'users',
            underscored:true
        }
        const tableDefinition={
            email:{
                type:DataTypes.STRING,
                unique:true,
                allowNull: false
            },
            name:{
                type:DataTypes.STRING,
                allowNull: false
            },
            password:{
                type:DataTypes.STRING,
                allowNull: false
            },
            active:{
                type:DataTypes.BOOLEAN,
                defaultValue: true,
            },
            img:{
                type:DataTypes.STRING,
            },
            is_data_master:{
                type:DataTypes.BOOLEAN,
                defaultValue: false,
            },
        }
        super.init(tableDefinition,tableConfig)
    }
    
    static associate(models) {
        this.hasOne(models.games_collection,{foreignKey:'id_user',foreignKeyConstraint:true,})
        this.hasOne(models.stars,{foreignKey:'id_user',foreignKeyConstraint:true,})
    }
}