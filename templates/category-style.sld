<?xml version="1.0" encoding="ISO-8859-1"?>
{% load filters %}
<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml"
  xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <Name>{{ category_codes|get:category }}</Name>
    <UserStyle>
      <Name>{{ category }}-style</Name>
      <Title>{{ category_codes|get:category }}</Title>
      <FeatureTypeStyle>
        <Rule>
          <Title>100-80</Title>
          <ogc:Filter>
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>{{ category }}</ogc:PropertyName>
              <ogc:LowerBoundary>
                <ogc:Literal>80</ogc:Literal>
              </ogc:LowerBoundary>
              <ogc:UpperBoundary>
                <ogc:Literal>100</ogc:Literal>
              </ogc:UpperBoundary>
            </ogc:PropertyIsBetween>
          </ogc:Filter>
          <PolygonSymbolizer>
             <Fill>
                <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                <CssParameter name="fill">{{ colors.0 }}</CssParameter>
                <CssParameter name="fill-opacity">1.0</CssParameter>
             </Fill>
             <Stroke>
                <CssParameter name="stroke">#FAFAFA</CssParameter>
                <CssParameter name="stroke-width">0.5</CssParameter>
             </Stroke>      
          </PolygonSymbolizer>
        </Rule>
        <Rule>
          <Title>79-60</Title>
          <ogc:Filter>
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>{{ category }}</ogc:PropertyName>
              <ogc:LowerBoundary>
                <ogc:Literal>60</ogc:Literal>
              </ogc:LowerBoundary>
              <ogc:UpperBoundary>
                <ogc:Literal>79</ogc:Literal>
              </ogc:UpperBoundary>
            </ogc:PropertyIsBetween>
          </ogc:Filter>
          <PolygonSymbolizer>
             <Fill>
                <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                <CssParameter name="fill">{{ colors.1 }}</CssParameter>
                <CssParameter name="fill-opacity">1.0</CssParameter>
             </Fill>
             <Stroke>
                <CssParameter name="stroke">#FAFAFA</CssParameter>
                <CssParameter name="stroke-width">0.5</CssParameter>
             </Stroke>      
          </PolygonSymbolizer>
        </Rule>
        <Rule>
          <Title>59-40</Title>
          <ogc:Filter>
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>{{ category }}</ogc:PropertyName>
              <ogc:LowerBoundary>
                <ogc:Literal>40</ogc:Literal>
              </ogc:LowerBoundary>
              <ogc:UpperBoundary>
                <ogc:Literal>59</ogc:Literal>
              </ogc:UpperBoundary>
            </ogc:PropertyIsBetween>
          </ogc:Filter>
          <PolygonSymbolizer>
             <Fill>
                <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                <CssParameter name="fill">{{ colors.2 }}</CssParameter>
                <CssParameter name="fill-opacity">1.0</CssParameter>
             </Fill>
             <Stroke>
                <CssParameter name="stroke">#FAFAFA</CssParameter>
                <CssParameter name="stroke-width">0.5</CssParameter>
             </Stroke>      
          </PolygonSymbolizer>
        </Rule>
        <Rule>
          <Title>39-20</Title>
          <ogc:Filter>
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>{{ category }}</ogc:PropertyName>
              <ogc:LowerBoundary>
                <ogc:Literal>20</ogc:Literal>
              </ogc:LowerBoundary>
              <ogc:UpperBoundary>
                <ogc:Literal>39</ogc:Literal>
              </ogc:UpperBoundary>
            </ogc:PropertyIsBetween>
          </ogc:Filter>
          <PolygonSymbolizer>
             <Fill>
                <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                <CssParameter name="fill">{{ colors.3 }}</CssParameter>
                <CssParameter name="fill-opacity">1.0</CssParameter>
             </Fill>
             <Stroke>
                <CssParameter name="stroke">#FAFAFA</CssParameter>
                <CssParameter name="stroke-width">0.5</CssParameter>
             </Stroke>      
          </PolygonSymbolizer>
        </Rule>
        <Rule>
          <Title>19-0</Title>
          <ogc:Filter>
            <ogc:PropertyIsBetween>
              <ogc:PropertyName>{{ category }}</ogc:PropertyName>
              <ogc:LowerBoundary>
                <ogc:Literal>0</ogc:Literal>
              </ogc:LowerBoundary>
              <ogc:UpperBoundary>
                <ogc:Literal>19</ogc:Literal>
              </ogc:UpperBoundary>
            </ogc:PropertyIsBetween>
          </ogc:Filter>
          <PolygonSymbolizer>
             <Fill>
                <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                <CssParameter name="fill">{{ colors.4 }}</CssParameter>
                <CssParameter name="fill-opacity">1.0</CssParameter>
             </Fill>
             <Stroke>
                <CssParameter name="stroke">#FAFAFA</CssParameter>
                <CssParameter name="stroke-width">0.5</CssParameter>
             </Stroke>      
          </PolygonSymbolizer>
        </Rule>
        <Rule>
          <Title>19-0</Title>
          <ogc:Filter>
            <ogc:PropertyIsNull>
              <ogc:PropertyName>{{ category }}</ogc:PropertyName>             
            </ogc:PropertyIsNull>
          </ogc:Filter>
          <PolygonSymbolizer>
             <Fill>
                <!-- CssParameters allowed are fill (the color) and fill-opacity -->
                <CssParameter name="fill">#BFBFBF</CssParameter>
                <CssParameter name="fill-opacity">1.0</CssParameter>
             </Fill>
             <Stroke>
                <CssParameter name="stroke">#FAFAFA</CssParameter>
                <CssParameter name="stroke-width">0.5</CssParameter>
             </Stroke>     
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
  	</UserStyle>
  </NamedLayer>
 </StyledLayerDescriptor>