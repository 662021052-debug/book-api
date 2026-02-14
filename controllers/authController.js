import pool from '../db/index.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
    try {
        const { username, password, name, tel } = req.body;

        if (!username || !password || !name || !tel) {
            return res.status(400).json({ message: "Username, password, name, and tel are required" });
        }


        const checkUserSql = 'SELECT * FROM users WHERE username = $1';
        const checkUser = await pool.query(checkUserSql, [username]);

        if (checkUser.rowCount > 0) {
            return res.status(400).json({ message: "This username is already taken" });
        }


        const hashedPassword = bcrypt.hashSync(password, 10);


        const insertUserSql = `
      INSERT INTO users (username, password, name, tel)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, name, tel
    `;

        const newUser = await pool.query(insertUserSql, [
            username,
            hashedPassword,
            name,
            tel
        ]);

        const user = newUser.rows[0];

        return res.status(201).json({
            message: "Register successful",
            user
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "error: " + err.message });
    }
};
export const login = async (req, res) => {
    const { username, password } = req.body ?? {};

    // ตรวจสอบ input
    if (!username || !password) {
        return res.status(400).json({ message: "ต้องกรอก username และ password" });
    }

    try {
        // ค้นหา user
        const usersql = 'SELECT * FROM users WHERE username = $1 LIMIT 1';
        const { rows } = await pool.query(usersql, [username]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        // ตรวจสอบรหัสผ่าน
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        const payload = {
            userid: user.id,
            username: user.username,
            tel: user.tel
        };

        // สร้าง access token
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        // สร้าง refresh token
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // ส่งผลลัพธ์กลับ
        return res.status(200).json({
            message: "เข้าสู่ระบบสำเร็จ",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                tel: user.tel
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "error: " + err.message });
    }
};
export const refresh = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);


    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign(
            { userId: user.id, username: user.username, tel: user.tel },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken });
    });
};