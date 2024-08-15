import json
import numpy as np

num_points = 50
x_max = 954
y_max = 476


#seeder taken directly from the docs
rng1 = np.random.default_rng()
rng1.random()  

np.random.seed(int(rng1.random())*10000)
x = np.random.rand(num_points * 2) * x_max
y = np.random.rand(num_points * 2) * y_max
valid_points = [(xi, yi) for xi, yi in zip(x, y) if yi <= -(0.001) * xi**2 + 500]

density = 2
center_x, center_y = 0,0
weights = np.exp(-((np.array([point[0] for point in valid_points]) - center_x)**2 + 
                    (np.array([point[1] for point in valid_points]) - center_y)**2) * density)

weighted_points = sorted(zip(valid_points, weights), key=lambda p: p[1], reverse=True)

final_points = [point for point, weight in weighted_points[:num_points]]

points_json = [{"x": point[0], "y": point[1]} for point in final_points]

with open('safepoints.json', 'w') as f:
    json.dump(points_json, f, indent=4)

print(f"{len(final_points)}")
