import { setTheme } from "./utils";
import { config, ModuleConfig, storage } from "/@/cool";
import "element-plus/theme-chalk/dark/css-vars.css";
import "./static/css/index.scss";

export default (): ModuleConfig => {
	return {
		components: [import("./components/theme.vue")],

		options: {
			// 推荐主题：'jihei', 'guolv', 'jiangzi'
			name: "default"
		},

		install(_, options) {
			const data =
				storage.get("theme") ||
				Object.assign(
					{
						isGroup: config.app.menu.isGroup,
						transition: config.app.router.transition
					},
					options
				);

			setTheme(data);
		}
	};
};
