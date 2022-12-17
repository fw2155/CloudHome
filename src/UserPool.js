import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_MtQIKmdsQ",
    ClientId: "57b6obg5d1shprts66nrd7504h"
}

export default new CognitoUserPool(poolData);