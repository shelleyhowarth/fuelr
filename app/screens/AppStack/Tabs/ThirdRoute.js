    const ThirdRoute = () => (
        <View style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
            { data ? 
                <LineChart
                    data={data}
                    width={layout.width}
                    height={220}
                    chartConfig={chartConfig}
                />
            : null}
        </View>
    );
    