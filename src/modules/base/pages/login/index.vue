<template>
	<div class="page-login">
		<div class="page-container">
			<div class="page-header">
				<img src="/logo.png" alt="Logo" />
			</div>
			<div class="page-box">
				<div class="box-left">
					<img src="/login-box-bg.svg" alt="box-bg" />
					<h2>甘肃新软科技有限责任公司</h2>
					<p>内部使用系统，不可泄露，如违反则会追求相关法律责任！</p>
				</div>
				<el-form label-position="top" class="box-form" :disabled="saving" size="large">
					<el-input
						v-model="form.username"
						placeholder="账号"
						maxlength="20"
						autocomplete="on"
					/>

					<el-input
						v-model="form.password"
						type="password"
						placeholder="密码"
						maxlength="20"
						autocomplete="off"
						show-password
					/>

					<div class="row" style="display: flex">
						<el-input
							v-model="form.verifyCode"
							placeholder="验证码"
							maxlength="4"
							@keyup.enter="toLogin"
						/>

						<captcha
							:ref="setRefs('captcha')"
							v-model="form.captchaId"
							@change="
								() => {
									form.verifyCode = '';
								}
							"
						/>
					</div>
					<div class="op">
						<el-button
							color="#2845B2"
							auto-insert-space
							:loading="saving"
							@click="toLogin"
							>登录</el-button
						>
					</div>
				</el-form>
			</div>
			<div class="page-footer" />
		</div>
	</div>
</template>

<script lang="ts" name="login" setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import { useBase } from "/$/base";
import Captcha from "./components/captcha.vue";

const { refs, setRefs, router, service } = useCool();
const { user, app } = useBase();

// 状态1
const saving = ref(false);

// 表单数据
const form = reactive({
	username: "",
	password: "",
	captchaId: "",
	verifyCode: ""
});

// 登录
async function toLogin() {
	if (!form.username) {
		return ElMessage.error("用户名不能为空");
	}

	if (!form.password) {
		return ElMessage.error("密码不能为空");
	}

	if (!form.verifyCode) {
		return ElMessage.error("图片验证码不能为空");
	}

	saving.value = true;

	try {
		// 登录
		await service.base.open.login(form).then((res) => {
			user.setToken(res);
		});

		// token 事件
		await Promise.all(app.events.hasToken.map((e) => e()));

		// 跳转
		router.push("/");
	} catch (err: any) {
		refs.value.captcha.refresh();
		ElMessage.error(err.message);
	}

	saving.value = false;
}
</script>

<style lang="scss" scoped>
.page-login {
	&::before {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin-left: -48%;
		background-image: url(/login-bg.svg);
		background-position: 100%;
		background-repeat: no-repeat;
		background-size: auto 100%;
		content: "";
		z-index: -1;
	}

	.page-container {
		max-width: 1400px;
		margin: 0 auto;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.page-header {
			padding: 30px 0;
			img {
				height: 50px;
			}
		}

		.page-box {
			display: flex;
			width: 100%;
			justify-content: space-between;
			align-items: center;

			.box-left {
				width: auto;

				img {
					width: 400px;
				}

				h2 {
					font-size: 1.875rem;
					margin-top: 40px;
					color: #fff;
				}
				p {
					color: #fff;
					margin-top: 20px;
					font-size: 15px;
				}
			}

			.box-form {
				transform: translateX(-30%);
				width: 400px;

				& > div {
					margin-bottom: 30px;
					&:last-child {
						margin-bottom: 0;
					}
				}

				.op {
					button {
						width: 100%;
					}
				}
			}
		}

		.page-footer {
			padding: 80px 0;
		}
	}
}
</style>
