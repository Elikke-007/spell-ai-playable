# 女性方向-英文版试玩
## 迭代更新步骤:
1. 底部已选择的模型: 更换 UI 编辑器中的 selectedItem 图片;
2. 手指停留位置: 更新 main.ts 中 _targetIndex 数组, 根据第 1 步中更换的图片编号减一;
3. 生成结果图: 更换 UI 编辑器中的 result 图片
4. 修改结果图比例(非必要): 需要保持高度不变，使用高度乘以比例得到宽度
5. 修改商店链接(非必要): 除了 main.ts 顶部的链接，unity 渠道还需要修改 .adapterrc 中 unity 渠道对应代码