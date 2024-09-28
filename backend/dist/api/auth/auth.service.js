"use strict";
// ここで必要なビジネスロジックを追加 コントローラーとモデルの中間層
// バリデーション、データ加工など
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.UserValidationError = void 0;
const database_1 = __importDefault(require("../config/database"));
const auth_model_1 = require("./auth.model");
const validator_1 = __importDefault(require("validator"));
const dateUtils_1 = require("../../utils/dateUtils");
const authUtils_1 = require("../../utils/authUtils");
// バリデーション時のエラーを作成
class UserValidationError extends Error {
    constructor(errors) {
        super("Validation failed");
        this.errors = errors;
        this.name = "UserValidationError";
    }
}
exports.UserValidationError = UserValidationError;
class AuthService {
    //バリデーションの設定
    validateUserData(data) {
        const errors = [];
        if (!data.name || data.name.trim().length === 0)
            errors.push("名前は必須です");
        if (data.name.trim().length > 50)
            errors.push("ユーザー名は５０字以内です");
        if (!data.email) {
            errors.push("メールアドレスは必須です");
        }
        else if (!validator_1.default.isEmail(data.email)) {
            errors.push("有効なメールアドレスを入力してください");
        }
        if (!data.passwordDigest) {
            errors.push("パスワードは必須です");
        }
        else if (data.passwordDigest.length < 8) {
            errors.push("パスワードは８文字以上でなくてはなりません");
        }
        if (data.generation && (data.generation < 10 || data.generation > 70))
            errors.push("不正な世代です");
        if (data.gender && !["男性", "女性", "秘密"].includes(data.gender))
            errors.push("性別が正しく登録されていません");
        return errors;
    }
    validateUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = this.validateUserData(data);
            if (errors.length > 0) {
                throw new UserValidationError(errors);
            }
        });
    }
    // ユーザーレスポンスを必要なものだけ表示するようにカスタマイズ
    formatUserResponse(user) {
        const { passwordDigest, isActive, lastLoginAt } = user, userWithoutSensitiveInfo = __rest(user, ["passwordDigest", "isActive", "lastLoginAt"]);
        return Object.assign(Object.assign({}, userWithoutSensitiveInfo), { generation: (0, auth_model_1.convertGeneration)(user.generation), createdAt: (0, dateUtils_1.formatToJapanTime)(user.createdAt), updatedAt: (0, dateUtils_1.formatToJapanTime)(user.updatedAt) });
    }
    // ユーザー作成
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, generation, passwordDigest } = input;
            // 性別が空欄の場合の処理
            const gender = input.gender === "" || input.gender === undefined ? "秘密" : input.gender;
            // ユーザーデータのユニーク判定
            const Uniqueness = yield database_1.default.user.findFirst({
                where: {
                    OR: [{ name }, { email }],
                },
            });
            if (Uniqueness) {
                if (Uniqueness.email === email) {
                    throw new Error("このメールアドレスは既に使用されています");
                }
                else {
                    throw new Error("このユーザー名は既に使用されています");
                }
            }
            // パスワードのハッシュ化
            const hashedPassword = yield (0, authUtils_1.hashPassword)(passwordDigest);
            // ユーザーデータをデータベースへ登録
            const user = yield database_1.default.user.create({
                data: {
                    name,
                    email,
                    passwordDigest: hashedPassword,
                    generation,
                    gender,
                },
            });
            return this.formatUserResponse(user);
        });
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
