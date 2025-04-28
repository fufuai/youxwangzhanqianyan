import os
import re
import argparse
import sys

def generate_image_paths(folder_name, total_images):
    """生成图片路径列表"""
    paths = []
    for i in range(1, total_images + 1):
        path = f"image/{folder_name}/{i}.jpg"
        paths.append(path)
    return paths

def generate_descriptions(total_images):
    """生成图片描述列表"""
    base_descriptions = [
        "这是一张精美的风景照片，展现了自然的壮丽景色。",
        "人物特写，捕捉了瞬间的情感表达。",
        "静物摄影，展现了物品的质感和细节。",
        "城市风光，展现了现代都市的繁华景象。",
        "自然风光，展现了山川河流的壮丽景色。",
        "人像摄影，展现了人物的自然表情。",
        "静物摄影，展现了物品的艺术美感。"
    ]
    
    descriptions = []
    for i in range(total_images):
        if i < len(base_descriptions):
            descriptions.append(base_descriptions[i])
        else:
            descriptions.append(f"这是一张精美的照片 {i+1}。")
    return descriptions

def generate_html_snippet(paths, descriptions):
    """生成HTML代码片段"""
    html = "const imagePaths = [\n"
    for path in paths:
        html += f"    '{path}',\n"
    html += "];\n\n"
    
    html += "const descriptions = [\n"
    for desc in descriptions:
        html += f"    '{desc}',\n"
    html += "];"
    
    return html

def update_html_file(html_file, folder_path, image_count):
    """更新HTML文件中的图片路径"""
    try:
        # 解析文件夹名称，去掉路径前缀
        folder_name = os.path.basename(folder_path)
        if not folder_name:
            folder_name = folder_path.split('/')[-1] if '/' in folder_path else folder_path.split('\\')[-1]
            
        # 获取HTML文件的基本名称（不含路径）
        html_basename = os.path.basename(html_file)
            
        # 生成图片路径和描述
        paths = generate_image_paths(folder_name, image_count)
        descriptions = generate_descriptions(image_count)
        html_snippet = generate_html_snippet(paths, descriptions)
        
        # 读取HTML文件
        with open(html_file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # 更新图片路径部分
        pattern = r"const imagePaths = \[[\s\S]*?\];"
        if re.search(pattern, content):
            updated_content = re.sub(
                pattern, 
                "const imagePaths = [\n" + "".join([f"    '{path}',\n" for path in paths]) + "];", 
                content
            )
            
            # 如果HTML文件中已经有descriptions部分，更新它
            desc_pattern = r"const descriptions = \[[\s\S]*?\];"
            if re.search(desc_pattern, updated_content):
                updated_content = re.sub(
                    desc_pattern,
                    "const descriptions = [\n" + "".join([f"    '{desc}',\n" for desc in descriptions]) + "];",
                    updated_content
                )
            else:
                # 如果没有descriptions部分，在imagePaths后面添加
                updated_content = updated_content.replace(
                    "const imagePaths = [\n" + "".join([f"    '{path}',\n" for path in paths]) + "];",
                    "const imagePaths = [\n" + "".join([f"    '{path}',\n" for path in paths]) + "];\n\n" +
                    "const descriptions = [\n" + "".join([f"    '{desc}',\n" for desc in descriptions]) + "];"
                )
            
            # 更新 imageFolderPath 和 totalImages
            folder_path_pattern = r"const imageFolderPath = '[^']*';"
            if re.search(folder_path_pattern, updated_content):
                updated_content = re.sub(
                    folder_path_pattern,
                    f"const imageFolderPath = 'image/{folder_name}/';",
                    updated_content
                )
            
            total_images_pattern = r"const totalImages = \d+;"
            if re.search(total_images_pattern, updated_content):
                updated_content = re.sub(
                    total_images_pattern,
                    f"const totalImages = {image_count};",
                    updated_content
                )
                
            # 更新轮播图部分
            carousel_pattern = r'<div class="carousel-slide">\s*<img src="image/[^"]*" alt="轮播图\d+">\s*</div>'
            carousel_slides = re.findall(carousel_pattern, updated_content)
            
            if carousel_slides:
                # 替换每个轮播图中的图片路径
                for i, slide in enumerate(carousel_slides):
                    img_index = (i % min(6, image_count)) + 1  # 轮播图通常使用前6张图片并循环
                    new_path = f'image/{folder_name}/{img_index}.jpg'
                    new_slide = re.sub(r'src="image/[^"]*"', f'src="{new_path}"', slide)
                    updated_content = updated_content.replace(slide, new_slide)
            
            # 更新推荐部分
            rec_pattern = r'<a href="[^"]*" class="related-image-card">\s*<img src="image/[^"]*" alt="[^"]*" loading="lazy">'
            rec_items = re.findall(rec_pattern, updated_content)
            
            if rec_items:
                # 替换每个推荐图片的路径
                for i, item in enumerate(rec_items):
                    img_index = (i % min(3, image_count)) + 1  # 推荐部分通常使用前3张图片
                    new_path = f'image/{folder_name}/{img_index}.jpg'
                    new_item = re.sub(r'src="image/[^"]*"', f'src="{new_path}"', item)
                    updated_content = updated_content.replace(item, new_item)
                    
            # 更新底部导航中的首页链接
            nav_pattern = r'<a href="[^"]*" class="nav-item active">\s*<span class="nav-icon">🏠</span>\s*<span class="nav-text">首页</span>\s*</a>'
            if re.search(nav_pattern, updated_content):
                updated_content = re.sub(
                    nav_pattern,
                    f'<a href="{html_basename}" class="nav-item active">\n            <span class="nav-icon">🏠</span>\n            <span class="nav-text">首页</span>\n        </a>',
                    updated_content
                )
            
            # 更新JavaScript中的lastHomePage变量
            last_home_page_pattern = r"localStorage\.setItem\('lastHomePage', '[^']*'\);"
            if re.search(last_home_page_pattern, updated_content):
                updated_content = re.sub(
                    last_home_page_pattern,
                    f"localStorage.setItem('lastHomePage', '{html_basename}');",
                    updated_content
                )
            
            # 保存更新后的内容
            with open(html_file, "w", encoding="utf-8") as f:
                f.write(updated_content)
            
            print(f"成功更新HTML文件：{html_file}")
            print("已更新：JavaScript变量、轮播图、推荐部分和底部导航")
            return True
        else:
            print(f"错误：在HTML文件中未找到图片路径部分")
            return False
    except Exception as e:
        print(f"更新HTML文件时出错：{str(e)}")
        return False

def extract_image_count(folder_name):
    """从文件夹名称中提取图片数量"""
    count_match = re.search(r'\[(\d+)P\]', folder_name)
    if count_match:
        try:
            return int(count_match.group(1))
        except ValueError:
            pass
    return None

def main():
    # 创建命令行参数解析器
    parser = argparse.ArgumentParser(description='更新HTML文件中的图片路径和描述')
    parser.add_argument('folder_path', help='图片文件夹路径，例如："肉肉番外[49P]"')
    parser.add_argument('-c', '--count', type=int, help='图片总数，如果不提供则尝试从文件夹名称中提取')
    parser.add_argument('-f', '--file', default='美图小游戏/测试.html', help='要更新的HTML文件路径')
    parser.add_argument('-o', '--output', help='如果指定，则将生成的代码保存到此文件，而不是更新HTML')
    
    # 解析命令行参数
    args = parser.parse_args()
    
    folder_path = args.folder_path
    html_file = args.file
    
    # 确定图片数量
    image_count = args.count
    if image_count is None:
        # 尝试从文件夹名中提取图片数量
        extracted_count = extract_image_count(folder_path)
        if extracted_count:
            image_count = extracted_count
            print(f"从文件夹名中提取到图片数量：{image_count}")
        else:
            image_count = 49  # 默认值
            print(f"无法从文件夹名中提取图片数量，使用默认值：{image_count}")
    
    # 如果指定了输出文件，则直接生成代码并保存
    if args.output:
        # 解析文件夹名称
        folder_name = os.path.basename(folder_path)
        if not folder_name:
            folder_name = folder_path.split('/')[-1] if '/' in folder_path else folder_path.split('\\')[-1]
            
        # 生成图片路径和描述
        paths = generate_image_paths(folder_name, image_count)
        descriptions = generate_descriptions(image_count)
        html_snippet = generate_html_snippet(paths, descriptions)
        
        # 保存到指定文件
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(html_snippet)
        print(f"已生成代码并保存到：{args.output}")
    else:
        # 更新HTML文件
        if update_html_file(html_file, folder_path, image_count):
            print(f"脚本执行完成，已更新 {html_file} 文件中的图片路径和描述")
        else:
            # 生成代码片段并保存到文件
            folder_name = os.path.basename(folder_path)
            paths = generate_image_paths(folder_name, image_count)
            descriptions = generate_descriptions(image_count)
            html_snippet = generate_html_snippet(paths, descriptions)
            
            default_output = "generated_code.js"
            with open(default_output, "w", encoding="utf-8") as f:
                f.write(html_snippet)
            print(f"由于无法更新HTML文件，代码已保存到 {default_output}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"发生错误：{str(e)}")
        sys.exit(1) 