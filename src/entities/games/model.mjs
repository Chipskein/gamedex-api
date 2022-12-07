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
            img: {
                type: DataTypes.STRING(1000000),
                defaultValue:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkWXUdBns9goe8j_pgvBEFuS9PJnOYAQ_Ld_g78DymXA&s",
            },
            genre: {
                type: DataTypes.STRING,
                //allowNull: false
            },
        }
        super.init(tableDefinition,tableConfig)
    }
    
    static associate(models) {
        this.hasOne(models.games_collection,{foreignKey:'id_game'})
        this.belongsTo(models.users,{foreignKey:'id_user',foreignKeyConstraint:true})
    }
}